package org.gramavoice.backend.controller;

import jakarta.validation.Valid;
import org.gramavoice.backend.dto.ComplaintCreateRequest;
import org.gramavoice.backend.dto.ComplaintResponse;
import org.gramavoice.backend.dto.ComplaintUpdateRequest;
import org.gramavoice.backend.dto.TimelineItemResponse;
import org.gramavoice.backend.model.AppNotification;
import org.gramavoice.backend.model.User;
import org.gramavoice.backend.model.UserRole;
import org.gramavoice.backend.service.ComplaintService;
import org.gramavoice.backend.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserService userService;

    public ComplaintController(ComplaintService complaintService, UserService userService) {
        this.complaintService = complaintService;
        this.userService = userService;
    }

    @GetMapping
    public List<ComplaintResponse> listComplaints(
            @RequestParam(required = false) String mobileNumber,
            @RequestParam(required = false) String status,
            Principal principal
    ) {
        User user = currentUser(principal);
        if (mobileNumber != null && !mobileNumber.isBlank() && (user.getRole().name().equals("ADMIN") || user.getRole().name().equals("OFFICER"))) {
            return complaintService.listAll(mobileNumber, status);
        }
        return complaintService.listForUser(user, status);
    }

    @PostMapping
    public ComplaintResponse createComplaint(@Valid @RequestBody ComplaintCreateRequest request, Principal principal) {
        return complaintService.createComplaint(request, currentUser(principal));
    }

    @GetMapping("/{id}")
    public ComplaintResponse getComplaint(@PathVariable Long id, Principal principal) {
        return complaintService.getComplaint(id, currentUser(principal));
    }

    @PatchMapping("/{id}")
    public ComplaintResponse updateComplaint(@PathVariable Long id, @RequestBody ComplaintUpdateRequest request, Principal principal) {
        return complaintService.updateComplaint(id, request, currentUser(principal));
    }

    @GetMapping("/{id}/timeline")
    public List<TimelineItemResponse> getTimeline(@PathVariable Long id, Principal principal) {
        return complaintService.getTimeline(id, currentUser(principal));
    }

    @GetMapping("/notifications/{mobileNumber}")
    public List<AppNotification> notifications(@PathVariable String mobileNumber, Principal principal) {
        User user = currentUser(principal);
        if (user.getRole() == UserRole.CITIZEN && !mobileNumber.equals(user.getMobileNumber())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Notifications belong to another user");
        }
        return complaintService.getNotifications(mobileNumber);
    }

    private User currentUser(Principal principal) {
        return userService.getByUsername(principal.getName());
    }
}
