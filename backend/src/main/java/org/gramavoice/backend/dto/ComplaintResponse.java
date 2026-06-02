package org.gramavoice.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ComplaintResponse(
        Long id,
        String referenceNumber,
        String ownerUsername,
        String citizenName,
        String mobileNumber,
        String subjectTa,
        String descriptionTa,
        String transcriptTa,
        String locationArea,
        String village,
        String district,
        String sourceMode,
        String categoryCode,
        String categoryLabelTa,
        String departmentCode,
        String departmentLabelTa,
        String assignedOfficerTa,
        String status,
        String priority,
        Double confidenceScore,
        String resolutionNoteTa,
        String evidenceUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<TimelineItemResponse> timeline
) {
}
