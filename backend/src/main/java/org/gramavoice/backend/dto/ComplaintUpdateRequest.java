package org.gramavoice.backend.dto;

public record ComplaintUpdateRequest(
        String status,
        String note,
        String actorName,
        String resolutionNote
) {
}
