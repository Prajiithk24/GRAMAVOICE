package org.gramavoice.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ComplaintCreateRequest(
        @NotBlank(message = "பெயர் தேவை")
        String citizenName,
        @NotBlank(message = "கைபேசி எண் தேவை")
        @Pattern(regexp = "\\d{10}", message = "சரியான 10 இலக்க கைபேசி எண் தேவை")
        String mobileNumber,
        String subject,
        @NotBlank(message = "குறை விவரம் தேவை")
        String description,
        String transcript,
        String village,
        String district,
        String locationArea,
        String evidenceUrl,
        String sourceMode
) {
}
