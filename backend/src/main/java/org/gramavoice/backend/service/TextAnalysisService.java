package org.gramavoice.backend.service;

import org.gramavoice.backend.model.CategoryRule;
import org.gramavoice.backend.model.PriorityLevel;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TextAnalysisService {

    public record AnalysisResult(
            String cleanedText,
            String summaryTa,
            String categoryCode,
            String categoryLabelTa,
            String departmentCode,
            String departmentLabelTa,
            PriorityLevel priority,
            double confidence,
            List<String> matchedKeywords
    ) {
    }

    public AnalysisResult analyse(String text, List<CategoryRule> rules) {
        String normalized = normalize(text);
        String cleaned = normalized.isBlank() ? "விவரம் வழங்கப்படவில்லை" : normalized;

        List<ScoredRule> scoredRules = rules.stream()
                .map(rule -> scoreRule(cleaned, rule))
                .sorted(Comparator.comparingInt(ScoredRule::score).reversed())
                .toList();

        ScoredRule best = scoredRules.isEmpty() ? null : scoredRules.get(0);

        if (best == null || best.score() == 0) {
            return new AnalysisResult(
                    cleaned,
                    createSummary(cleaned),
                    "GENERAL",
                    "பொது குறை",
                    "GENERAL",
                    "மக்கள் சேவை மையம்",
                    PriorityLevel.MEDIUM,
                    0.42,
                    List.of("பொது")
            );
        }

        double confidence = Math.min(0.98, 0.45 + (best.score() * 0.12));
        return new AnalysisResult(
                cleaned,
                createSummary(cleaned),
                best.rule().getCode(),
                best.rule().getNameTa(),
                best.rule().getDepartmentCode(),
                best.rule().getDepartmentNameTa(),
                PriorityLevel.valueOf(best.rule().getPriorityCode()),
                confidence,
                best.matchedKeywords()
        );
    }

    public String normalize(String text) {
        if (text == null) {
            return "";
        }
        return text
                .replaceAll("[\\n\\r\\t]+", " ")
                .replaceAll("[.,;:!?]+", " ")
                .replaceAll("\\s{2,}", " ")
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    private ScoredRule scoreRule(String cleaned, CategoryRule rule) {
        List<String> keywords = Arrays.stream(rule.getKeywordsTa().split(","))
                .map(String::trim)
                .filter(keyword -> !keyword.isBlank())
                .toList();

        List<String> matched = new ArrayList<>();
        int score = 0;
        for (String keyword : keywords) {
            if (cleaned.contains(keyword.toLowerCase(Locale.ROOT))) {
                matched.add(keyword);
                score += keyword.length() > 4 ? 2 : 1;
            }
        }
        return new ScoredRule(rule, score, matched);
    }

    private String createSummary(String cleaned) {
        String[] words = cleaned.split(" ");
        return Arrays.stream(words)
                .filter(Objects::nonNull)
                .filter(word -> !word.isBlank())
                .limit(8)
                .collect(Collectors.joining(" "));
    }

    private record ScoredRule(CategoryRule rule, int score, List<String> matchedKeywords) {
    }
}
