package org.gramavoice.backend.service;

import org.gramavoice.backend.model.User;
import org.gramavoice.backend.model.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Service
public class AuthTokenService {

    private static final long TOKEN_TTL_SECONDS = 60L * 60L * 24L;

    private final String secret;

    public AuthTokenService(@Value("${app.auth.secret:change-this-secret-before-deploy}") String secret) {
        this.secret = secret;
    }

    public String issue(User user) {
        long expiresAt = Instant.now().plusSeconds(TOKEN_TTL_SECONDS).getEpochSecond();
        String payload = user.getUsername() + "|" + user.getRole().name() + "|" + expiresAt;
        String encodedPayload = encode(payload);
        return encodedPayload + "." + sign(encodedPayload);
    }

    public Optional<AuthUser> verify(String token) {
        if (token == null || token.isBlank() || !token.contains(".")) {
            return Optional.empty();
        }
        String[] parts = token.split("\\.", 2);
        if (parts.length != 2 || !sign(parts[0]).equals(parts[1])) {
            return Optional.empty();
        }
        String payload = decode(parts[0]);
        String[] values = payload.split("\\|", 3);
        if (values.length != 3) {
            return Optional.empty();
        }
        long expiresAt;
        try {
            expiresAt = Long.parseLong(values[2]);
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
        if (expiresAt < Instant.now().getEpochSecond()) {
            return Optional.empty();
        }
        try {
            return Optional.of(new AuthUser(values[0], UserRole.valueOf(values[1])));
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    private String sign(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return encode(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to sign auth token", ex);
        }
    }

    private String encode(String value) {
        return encode(value.getBytes(StandardCharsets.UTF_8));
    }

    private String encode(byte[] value) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
    }

    private String decode(String value) {
        return new String(Base64.getUrlDecoder().decode(value), StandardCharsets.UTF_8);
    }

    public record AuthUser(String username, UserRole role) {
    }
}
