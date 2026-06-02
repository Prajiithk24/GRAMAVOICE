package org.gramavoice.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gramavoice.backend.model.CategoryRule;
import org.gramavoice.backend.model.PriorityLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TextAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(TextAnalysisService.class);

    private static final Map<String, List<String>> EXTRA_KEYWORDS = Map.of(
            "WATER_SHORTAGE", List.of("நீர் வரல", "நீர் வரவில்லை", "தண்ணீர் இல்லை", "குடிநீர் இல்லை", "பம்பு", "தொட்டி", "வறட்சி", "water"),
            "ELECTRICITY_OUTAGE", List.of("மின் போக்கு", "மின் தடை", "மின் வெட்டு", "மின் இல்லை", "கம்பம் விழு", "ஷார்ட்", "power cut"),
            "ROAD_DAMAGE", List.of("சாலை சேதம்", "பாதை சேதம்", "குழி", "தார்", "சக்கர வண்டி", "accident road"),
            "SANITATION", List.of("குப்பை", "கழிவு", "துர்நாற்றம்", "வடிகால் அடைப்பு", "சுத்தம் இல்லை"),
            "STREETLIGHT", List.of("தெருவிளக்கு", "விளக்கு எரியவில்லை", "இருள்", "பள்ளி அருகே விளக்கு"),
            "RATION_SUPPLY", List.of("ரேஷன்", "அரிசி", "சர்க்கரை", "பொருட்கள்", "அட்டை", "விநியோகம் இல்லை")
    );

    private static final List<String> CRITICAL_MARKERS = List.of(
            "உயிர்", "ஆபத்து", "விபத்து", "தீ", "வெடி", "மரணம்", "அவசர", "மருத்துவ", "ஆஸ்பத்திரி",
            "குழந்தைகள் சிரமம்", "மின் கம்பம் விழு", "விழுந்து", "electrocution", "emergency", "critical"
    );

    private static final List<String> HIGH_MARKERS = List.of(
            "மூன்று நாள்", "3 நாள்", "நாட்களாக", "ஒரு வாரம்", "7 நாள்", "பள்ளி", "மருத்துவமனை",
            "முழு தெரு", "அனைவரும்", "பாதிப்பு", "தொடர்ச்சியாக", "daily problem"
    );

    private final ObjectMapper objectMapper;
    private final RestClient sarvamClient;
    private final boolean sarvamEnabled;
    private final String sarvamApiKey;
    private final String sarvamModel;

    public TextAnalysisService(
            ObjectMapper objectMapper,
            RestClient.Builder restClientBuilder,
            @Value("${sarvam.enabled:true}") boolean sarvamEnabled,
            @Value("${sarvam.api-key:}") String sarvamApiKey,
            @Value("${sarvam.base-url:https://api.sarvam.ai}") String sarvamBaseUrl,
            @Value("${sarvam.model:sarvam-30b}") String sarvamModel
    ) {
        this.objectMapper = objectMapper;
        this.sarvamClient = restClientBuilder.baseUrl(sarvamBaseUrl).build();
        this.sarvamEnabled = sarvamEnabled;
        this.sarvamApiKey = sarvamApiKey;
        this.sarvamModel = sarvamModel;
    }

    public record AnalysisResult(
            String cleanedText,
            String summaryTa,
            String categoryCode,
            String categoryLabelTa,
            String departmentCode,
            String departmentLabelTa,
            PriorityLevel priority,
            double confidence,
            List<String> matchedKeywords,
            String analysisSource
    ) {
    }

    public AnalysisResult analyse(String text, List<CategoryRule> rules) {
        String cleaned = normalize(text);
        if (cleaned.isBlank()) {
            return generalFallback(cleaned, "RULES");
        }

        AnalysisResult rulesResult = analyseWithRules(cleaned, rules);
        Optional<AnalysisResult> sarvamResult = Optional.empty();
        if (sarvamEnabled && sarvamApiKey != null && !sarvamApiKey.isBlank()) {
            sarvamResult = analyseWithSarvam(cleaned, rules);
        }

        AnalysisResult merged = sarvamResult
                .map(sarvam -> mergeResults(rulesResult, sarvam, rules, cleaned))
                .orElse(rulesResult);

        Optional<PriorityLevel> severityHint = detectSeverityFromText(cleaned);
        PriorityLevel categoryDefault = defaultPriorityForCategory(merged.categoryCode(), rules);
        PriorityLevel finalPriority = severityHint
                .map(hint -> highestPriority(merged.priority(), hint, categoryDefault))
                .orElse(highestPriority(merged.priority(), categoryDefault));

        return new AnalysisResult(
                merged.cleanedText(),
                merged.summaryTa(),
                merged.categoryCode(),
                merged.categoryLabelTa(),
                merged.departmentCode(),
                merged.departmentLabelTa(),
                finalPriority,
                merged.confidence(),
                merged.matchedKeywords(),
                merged.analysisSource()
        );
    }

    private AnalysisResult mergeResults(
            AnalysisResult rulesResult,
            AnalysisResult sarvamResult,
            List<CategoryRule> rules,
            String cleaned
    ) {
        int ruleScore = scoreForCategory(cleaned, rulesResult.categoryCode(), rules);
        boolean sarvamCategoryValid = rules.stream().anyMatch(r -> r.getCode().equals(sarvamResult.categoryCode()));

        String categoryCode;
        String source;
        if (!sarvamCategoryValid) {
            categoryCode = rulesResult.categoryCode();
            source = "HYBRID_RULES";
        } else if (ruleScore >= 3 && sarvamResult.confidence() < 0.7) {
            categoryCode = rulesResult.categoryCode();
            source = "HYBRID_RULES";
        } else if (ruleScore >= 2 && sarvamResult.confidence() < 0.55) {
            categoryCode = rulesResult.categoryCode();
            source = "HYBRID_RULES";
        } else {
            categoryCode = sarvamResult.categoryCode();
            source = "HYBRID_SARVAM";
        }

        CategoryRule rule = rules.stream()
                .filter(r -> r.getCode().equals(categoryCode))
                .findFirst()
                .orElse(null);

        if (rule == null) {
            return rulesResult;
        }

        String summary = firstNonBlank(sarvamResult.summaryTa(), rulesResult.summaryTa(), createSummary(cleaned));
        double confidence = Math.max(sarvamResult.confidence(), rulesResult.confidence());

        return new AnalysisResult(
                cleaned,
                summary,
                rule.getCode(),
                rule.getNameTa(),
                rule.getDepartmentCode(),
                rule.getDepartmentNameTa(),
                highestPriority(
                        parsePrioritySafe(sarvamResult.priority()),
                        parsePrioritySafe(rulesResult.priority()),
                        PriorityLevel.valueOf(rule.getPriorityCode())
                ),
                confidence,
                rulesResult.matchedKeywords().isEmpty() ? sarvamResult.matchedKeywords() : rulesResult.matchedKeywords(),
                source
        );
    }

    private AnalysisResult analyseWithRules(String text, List<CategoryRule> rules) {
        String cleaned = text.isBlank() ? "விவரம் வழங்கப்படவில்லை" : text;

        List<ScoredRule> scoredRules = rules.stream()
                .map(rule -> scoreRule(cleaned, rule))
                .sorted(Comparator.comparingInt(ScoredRule::score).reversed())
                .toList();

        ScoredRule best = scoredRules.isEmpty() ? null : scoredRules.get(0);

        if (best == null || best.score() == 0) {
            return generalFallback(cleaned, "RULES");
        }

        double confidence = Math.min(0.95, 0.5 + (best.score() * 0.1));
        PriorityLevel priority = PriorityLevel.valueOf(best.rule().getPriorityCode());

        return new AnalysisResult(
                cleaned,
                createSummary(cleaned),
                best.rule().getCode(),
                best.rule().getNameTa(),
                best.rule().getDepartmentCode(),
                best.rule().getDepartmentNameTa(),
                priority,
                confidence,
                best.matchedKeywords(),
                "RULES"
        );
    }

    private Optional<AnalysisResult> analyseWithSarvam(String text, List<CategoryRule> rules) {
        try {
            ChatCompletionResponse response = sarvamClient.post()
                    .uri("/v1/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("api-subscription-key", sarvamApiKey)
                    .body(Map.of(
                            "model", sarvamModel,
                            "temperature", 0.05,
                            "max_tokens", 800,
                            "messages", List.of(
                                    Map.of("role", "system", "content", sarvamSystemPrompt(rules)),
                                    Map.of("role", "user", "content", text)
                            )
                    ))
                    .retrieve()
                    .body(ChatCompletionResponse.class);

            String content = response == null || response.choices() == null || response.choices().isEmpty()
                    ? ""
                    : response.choices().get(0).message().content();
            if (content == null || content.isBlank()) {
                log.warn("Sarvam returned empty content");
                return Optional.empty();
            }

            SarvamAnalysis sarvamAnalysis = objectMapper.readValue(extractJson(content), SarvamAnalysis.class);
            return toAnalysisResult(text, sarvamAnalysis, rules);
        } catch (Exception ex) {
            log.warn("Sarvam analysis failed, using rules fallback: {}", ex.getMessage());
            return Optional.empty();
        }
    }

    private String sarvamSystemPrompt(List<CategoryRule> rules) {
        String categories = rules.stream()
                .map(rule -> "- code=" + rule.getCode()
                        + " | label=" + rule.getNameTa()
                        + " | department=" + rule.getDepartmentNameTa()
                        + " | defaultPriority=" + rule.getPriorityCode()
                        + " | keywords=" + rule.getKeywordsTa())
                .collect(Collectors.joining("\n"));

        return """
                You classify Tamil civic grievances for GramaVoice (Tamil Nadu village complaints).
                Return ONLY one compact JSON object. No markdown, no explanation.

                Required JSON keys:
                cleanedText, summaryTa, categoryCode, categoryLabelTa, departmentCode, departmentLabelTa, priority, confidence, matchedKeywords

                Rules:
                - categoryCode MUST be exactly one code from the allowed list below.
                - priority MUST be one of: LOW, MEDIUM, HIGH, CRITICAL
                - confidence is 0.0 to 1.0
                - summaryTa: short Tamil title, max 8 words
                - matchedKeywords: array of Tamil/English words found in input

                Severity guide (priority):
                - CRITICAL: life danger, injury, fire, fallen electric pole, hospital emergency, electrocution risk
                - HIGH: no water 2+ days, children/elderly affected, major road blocked, ration denied, long outage
                - MEDIUM: regular delay, single street light, local sanitation issue
                - LOW: minor inconvenience, information request

                Examples:
                Input: "மூன்று நாட்களாக குடிநீர் வரவில்லை குழந்தைகள் சிரமப்படுகின்றனர்"
                -> categoryCode WATER_SHORTAGE, priority HIGH

                Input: "மின் கம்பம் விழுந்து ஆபத்தாக உள்ளது"
                -> categoryCode ELECTRICITY_OUTAGE, priority CRITICAL

                Input: "பள்ளி அருகே தெருவிளக்கு இரண்டு நாட்களாக எரியவில்லை"
                -> categoryCode STREETLIGHT, priority MEDIUM

                Allowed categories:
                """ + categories;
    }

    private Optional<AnalysisResult> toAnalysisResult(String cleaned, SarvamAnalysis sarvamAnalysis, List<CategoryRule> rules) {
        if (sarvamAnalysis == null || sarvamAnalysis.categoryCode() == null) {
            return Optional.empty();
        }

        Map<String, CategoryRule> rulesByCode = rules.stream()
                .collect(Collectors.toMap(CategoryRule::getCode, rule -> rule, (first, second) -> first, HashMap::new));
        CategoryRule rule = rulesByCode.get(sarvamAnalysis.categoryCode());
        if (rule == null) {
            log.warn("Sarvam returned unknown category: {}", sarvamAnalysis.categoryCode());
            return Optional.empty();
        }

        PriorityLevel priority = parsePriority(sarvamAnalysis.priority())
                .orElseGet(() -> PriorityLevel.valueOf(rule.getPriorityCode()));
        double confidence = sarvamAnalysis.confidence() == null
                ? 0.75
                : Math.max(0.0, Math.min(0.99, sarvamAnalysis.confidence()));
        List<String> matchedKeywords = sarvamAnalysis.matchedKeywords() == null
                ? List.of()
                : sarvamAnalysis.matchedKeywords();

        return Optional.of(new AnalysisResult(
                cleaned,
                blankFallback(sarvamAnalysis.summaryTa(), createSummary(cleaned)),
                rule.getCode(),
                rule.getNameTa(),
                rule.getDepartmentCode(),
                rule.getDepartmentNameTa(),
                priority,
                confidence,
                matchedKeywords,
                "SARVAM"
        ));
    }

    private Optional<PriorityLevel> detectSeverityFromText(String text) {
        String lower = text.toLowerCase(Locale.ROOT);
        if (containsAny(lower, CRITICAL_MARKERS)) {
            return Optional.of(PriorityLevel.CRITICAL);
        }
        if (containsAny(lower, HIGH_MARKERS)) {
            return Optional.of(PriorityLevel.HIGH);
        }
        if (lower.matches(".*\\b([3-9]|1[0-9])\\s*நாள்.*") || lower.contains("week") || lower.contains("வாரம்")) {
            return Optional.of(PriorityLevel.HIGH);
        }
        return Optional.empty();
    }

    private PriorityLevel defaultPriorityForCategory(String categoryCode, List<CategoryRule> rules) {
        return rules.stream()
                .filter(rule -> rule.getCode().equals(categoryCode))
                .findFirst()
                .map(rule -> PriorityLevel.valueOf(rule.getPriorityCode()))
                .orElse(PriorityLevel.MEDIUM);
    }

    private int scoreForCategory(String cleaned, String categoryCode, List<CategoryRule> rules) {
        return rules.stream()
                .filter(rule -> rule.getCode().equals(categoryCode))
                .findFirst()
                .map(rule -> scoreRule(cleaned, rule).score())
                .orElse(0);
    }

    private AnalysisResult generalFallback(String cleaned, String source) {
        return new AnalysisResult(
                cleaned.isBlank() ? "விவரம் வழங்கப்படவில்லை" : cleaned,
                createSummary(cleaned),
                "GENERAL",
                "பொது குறை",
                "GENERAL",
                "மக்கள் சேவை மையம்",
                PriorityLevel.MEDIUM,
                0.42,
                List.of("பொது"),
                source
        );
    }

    public String normalize(String text) {
        if (text == null) {
            return "";
        }
        return text
                .replaceAll("[\\n\\r\\t]+", " ")
                .replaceAll("\\s{2,}", " ")
                .trim();
    }

    private ScoredRule scoreRule(String cleaned, CategoryRule rule) {
        List<String> keywords = new ArrayList<>();
        keywords.addAll(Arrays.stream(rule.getKeywordsTa().split(","))
                .map(String::trim)
                .filter(keyword -> !keyword.isBlank())
                .toList());
        keywords.addAll(EXTRA_KEYWORDS.getOrDefault(rule.getCode(), List.of()));

        String searchable = cleaned.toLowerCase(Locale.ROOT);
        List<String> matched = new ArrayList<>();
        int score = 0;
        for (String keyword : keywords) {
            String key = keyword.toLowerCase(Locale.ROOT);
            if (searchable.contains(key) || cleaned.contains(keyword)) {
                matched.add(keyword);
                score += keyword.length() > 4 ? 2 : 1;
            }
        }
        return new ScoredRule(rule, score, matched);
    }

    private Optional<PriorityLevel> parsePriority(String priority) {
        if (priority == null || priority.isBlank()) {
            return Optional.empty();
        }
        try {
            return Optional.of(PriorityLevel.valueOf(priority.trim().toUpperCase(Locale.ROOT)));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    private PriorityLevel parsePrioritySafe(PriorityLevel level) {
        return level == null ? PriorityLevel.MEDIUM : level;
    }

    private PriorityLevel highestPriority(PriorityLevel... levels) {
        return Arrays.stream(levels)
                .filter(Objects::nonNull)
                .max(Comparator.comparingInt(this::priorityRank))
                .orElse(PriorityLevel.MEDIUM);
    }

    private int priorityRank(PriorityLevel level) {
        return switch (level) {
            case LOW -> 1;
            case MEDIUM -> 2;
            case HIGH -> 3;
            case CRITICAL -> 4;
        };
    }

    private boolean containsAny(String text, List<String> markers) {
        for (String marker : markers) {
            if (text.contains(marker.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private String extractJson(String content) {
        String trimmed = content.trim();
        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return trimmed.substring(start, end + 1);
        }
        return trimmed;
    }

    private String createSummary(String cleaned) {
        String[] words = cleaned.split(" ");
        return Arrays.stream(words)
                .filter(Objects::nonNull)
                .filter(word -> !word.isBlank())
                .limit(8)
                .collect(Collectors.joining(" "));
    }

    private String blankFallback(String input, String fallback) {
        return input == null || input.isBlank() ? fallback : input;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private record ScoredRule(CategoryRule rule, int score, List<String> matchedKeywords) {
    }

    private record ChatCompletionResponse(List<Choice> choices) {
    }

    private record Choice(ChatMessage message) {
    }

    private record ChatMessage(String content) {
    }

    private record SarvamAnalysis(
            String cleanedText,
            String summaryTa,
            String categoryCode,
            String categoryLabelTa,
            String departmentCode,
            String departmentLabelTa,
            String priority,
            Double confidence,
            List<String> matchedKeywords
    ) {
    }
}
