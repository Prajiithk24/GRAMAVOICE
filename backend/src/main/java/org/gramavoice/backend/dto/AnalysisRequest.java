package org.gramavoice.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AnalysisRequest(
        @NotBlank String text
) {
}
