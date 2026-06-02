package org.gramavoice.backend.dto;

import java.util.List;

public record AnalysisResponse(
        String cleanedText,
        String summaryTa,
        String categoryCode,
        String categoryLabelTa,
        String departmentCode,
        String departmentLabelTa,
        String priority,
        double confidenceScore,
        List<String> matchedKeywords,
        String analysisSource
) {
}
