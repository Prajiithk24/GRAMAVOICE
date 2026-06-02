package org.gramavoice.backend.controller;

import jakarta.validation.Valid;
import org.gramavoice.backend.dto.AnalysisRequest;
import org.gramavoice.backend.dto.AnalysisResponse;
import org.gramavoice.backend.model.CategoryRule;
import org.gramavoice.backend.repository.CategoryRuleRepository;
import org.gramavoice.backend.service.TextAnalysisService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final TextAnalysisService textAnalysisService;
    private final CategoryRuleRepository categoryRuleRepository;

    public AnalysisController(TextAnalysisService textAnalysisService, CategoryRuleRepository categoryRuleRepository) {
        this.textAnalysisService = textAnalysisService;
        this.categoryRuleRepository = categoryRuleRepository;
    }

    @PostMapping("/preview")
    public AnalysisResponse preview(@Valid @RequestBody AnalysisRequest request) {
        List<CategoryRule> rules = categoryRuleRepository.findAll();
        TextAnalysisService.AnalysisResult result = textAnalysisService.analyse(request.text(), rules);
        return toResponse(result);
    }

    private AnalysisResponse toResponse(TextAnalysisService.AnalysisResult result) {
        return new AnalysisResponse(
                result.cleanedText(),
                result.summaryTa(),
                result.categoryCode(),
                result.categoryLabelTa(),
                result.departmentCode(),
                result.departmentLabelTa(),
                result.priority().name(),
                result.confidence(),
                result.matchedKeywords(),
                result.analysisSource()
        );
    }
}
