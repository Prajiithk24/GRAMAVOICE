package org.gramavoice.backend.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.gramavoice.backend.model.User;
import org.gramavoice.backend.model.UserRole;
import org.gramavoice.backend.service.AuthTokenService;
import org.gramavoice.backend.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final AuthTokenService authTokenService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, AuthTokenService authTokenService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.authTokenService = authTokenService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        User user = userService.getByUsername(authentication.getName());
        return toAuthResponse(user);
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        User user = new User(
                request.username(),
                request.password(),
                request.fullName(),
                request.mobileNumber(),
                request.village(),
                request.district(),
                UserRole.CITIZEN
        );
        return toAuthResponse(userService.save(user));
    }

    @GetMapping("/me")
    public AuthProfile me(Principal principal) {
        return toProfile(userService.getByUsername(principal.getName()));
    }

    @PatchMapping("/me")
    public AuthProfile updateMe(Principal principal, @RequestBody ProfileUpdateRequest request) {
        return toProfile(userService.updateProfile(
                principal.getName(),
                request.fullName(),
                request.mobileNumber(),
                request.village(),
                request.district()
        ));
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(authTokenService.issue(user), toProfile(user));
    }

    private AuthProfile toProfile(User user) {
        return new AuthProfile(
                user.getUsername(),
                user.getRole().name(),
                fallback(user.getFullName(), user.getUsername()),
                fallback(user.getMobileNumber(), ""),
                fallback(user.getVillage(), ""),
                fallback(user.getDistrict(), ""),
                fallback(user.getDepartmentCode(), "")
        );
    }

    private String fallback(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password
    ) {
    }

    public record RegisterRequest(
            @NotBlank String username,
            @NotBlank String password,
            @NotBlank String fullName,
            @NotBlank @Pattern(regexp = "\\d{10}") String mobileNumber,
            String village,
            String district
    ) {
    }

    public record ProfileUpdateRequest(
            String fullName,
            String mobileNumber,
            String village,
            String district
    ) {
    }

    public record AuthResponse(String token, AuthProfile user) {
    }

    public record AuthProfile(
            String username,
            String role,
            String fullName,
            String mobileNumber,
            String village,
            String district,
            String departmentCode
    ) {
    }
}
