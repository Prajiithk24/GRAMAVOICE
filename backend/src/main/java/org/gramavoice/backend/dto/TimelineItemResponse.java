package org.gramavoice.backend.dto;

import java.time.LocalDateTime;

public record TimelineItemResponse(
        Long id,
        String titleTa,
        String noteTa,
        String actorNameTa,
        String status,
        LocalDateTime createdAt
) {
}
