package org.gramavoice.backend.controller;

import jakarta.validation.Valid;
import org.gramavoice.backend.dto.ComplaintCreateRequest;
import org.gramavoice.backend.dto.ComplaintResponse;
import org.gramavoice.backend.dto.ComplaintUpdateRequest;
import org.gramavoice.backend.dto.TimelineItemResponse;
import org.gramavoice.backend.model.AppNotification;
import org.gramavoice.backend.service.ComplaintService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public List<ComplaintResponse> listComplaints(
            @RequestParam(required = false) String mobileNumber,
            @RequestParam(required = false) String status
    ) {
        return complaintService.listAll(mobileNumber, status);
    }

    @PostMapping
    public ComplaintResponse createComplaint(@Valid @RequestBody ComplaintCreateRequest request) {
        return complaintService.createComplaint(request);
    }

    @GetMapping("/{id}")
    public ComplaintResponse getComplaint(@PathVariable Long id) {
        return complaintService.getComplaint(id);
    }

    @PatchMapping("/{id}")
    public ComplaintResponse updateComplaint(@PathVariable Long id, @RequestBody ComplaintUpdateRequest request) {
        return complaintService.updateComplaint(id, request);
    }

    @GetMapping("/{id}/timeline")
    public List<TimelineItemResponse> getTimeline(@PathVariable Long id) {
        return complaintService.getTimeline(id);
    }

    @GetMapping("/notifications/{mobileNumber}")
    public List<AppNotification> notifications(@PathVariable String mobileNumber) {
        return complaintService.getNotifications(mobileNumber);
    }
}
