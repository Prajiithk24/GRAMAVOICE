package org.gramavoice.backend.service;

import org.gramavoice.backend.dto.ComplaintCreateRequest;
import org.gramavoice.backend.dto.ComplaintResponse;
import org.gramavoice.backend.dto.ComplaintUpdateRequest;
import org.gramavoice.backend.dto.TimelineItemResponse;
import org.gramavoice.backend.model.AppNotification;
import org.gramavoice.backend.model.CategoryRule;
import org.gramavoice.backend.model.Complaint;
import org.gramavoice.backend.model.ComplaintHistory;
import org.gramavoice.backend.model.ComplaintStatus;
import org.gramavoice.backend.model.PriorityLevel;
import org.gramavoice.backend.model.User;
import org.gramavoice.backend.model.UserRole;
import org.gramavoice.backend.repository.AppNotificationRepository;
import org.gramavoice.backend.repository.CategoryRuleRepository;
import org.gramavoice.backend.repository.ComplaintHistoryRepository;
import org.gramavoice.backend.repository.ComplaintRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintHistoryRepository complaintHistoryRepository;
    private final CategoryRuleRepository categoryRuleRepository;
    private final AppNotificationRepository notificationRepository;
    private final TextAnalysisService textAnalysisService;
    private final ReferenceNumberService referenceNumberService;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            ComplaintHistoryRepository complaintHistoryRepository,
            CategoryRuleRepository categoryRuleRepository,
            AppNotificationRepository notificationRepository,
            TextAnalysisService textAnalysisService,
            ReferenceNumberService referenceNumberService
    ) {
        this.complaintRepository = complaintRepository;
        this.complaintHistoryRepository = complaintHistoryRepository;
        this.categoryRuleRepository = categoryRuleRepository;
        this.notificationRepository = notificationRepository;
        this.textAnalysisService = textAnalysisService;
        this.referenceNumberService = referenceNumberService;
    }

    public List<ComplaintResponse> listAll(String mobileNumber, String status) {
        List<Complaint> complaints;
        if (mobileNumber != null && !mobileNumber.isBlank()) {
            complaints = complaintRepository.findByMobileNumberOrderByCreatedAtDesc(mobileNumber);
        } else if (status != null && !status.isBlank()) {
            complaints = complaintRepository.findByStatusOrderByCreatedAtDesc(ComplaintStatus.valueOf(status));
        } else {
            complaints = complaintRepository.findAll()
                    .stream()
                    .sorted(Comparator.comparing(Complaint::getCreatedAt).reversed())
                    .toList();
        }

        return complaints.stream().map(this::toResponse).toList();
    }

    public List<ComplaintResponse> listForUser(User user, String status) {
        if (user.getRole() == UserRole.ADMIN) {
            return listAll(null, status);
        }
        if (user.getRole() == UserRole.OFFICER) {
            String departmentCode = user.getDepartmentCode();
            List<Complaint> complaints = complaintRepository.findAll()
                    .stream()
                    .filter(complaint -> departmentCode == null
                            || departmentCode.isBlank()
                            || departmentCode.equals(complaint.getDepartmentCode()))
                    .sorted(Comparator.comparing(Complaint::getCreatedAt).reversed())
                    .toList();
            if (status != null && !status.isBlank()) {
                ComplaintStatus wantedStatus = ComplaintStatus.valueOf(status);
                complaints = complaints.stream().filter(complaint -> complaint.getStatus() == wantedStatus).toList();
            }
            return complaints.stream().map(this::toResponse).toList();
        }
        List<Complaint> complaints = complaintRepository.findByOwnerUsernameOrderByCreatedAtDesc(user.getUsername());
        if (complaints.isEmpty() && user.getMobileNumber() != null && !user.getMobileNumber().isBlank()) {
            complaints = complaintRepository.findByMobileNumberOrderByCreatedAtDesc(user.getMobileNumber());
        }
        if (status != null && !status.isBlank()) {
            ComplaintStatus wantedStatus = ComplaintStatus.valueOf(status);
            complaints = complaints.stream().filter(complaint -> complaint.getStatus() == wantedStatus).toList();
        }
        return complaints.stream().map(this::toResponse).toList();
    }

    public ComplaintResponse createComplaint(ComplaintCreateRequest request) {
        List<CategoryRule> rules = categoryRuleRepository.findAll();
        String inputText = request.transcript() != null && !request.transcript().isBlank()
                ? request.transcript()
                : request.description();

        TextAnalysisService.AnalysisResult analysis = textAnalysisService.analyse(inputText, rules);

        Complaint complaint = new Complaint();
        complaint.setReferenceNumber(referenceNumberService.nextReference());
        complaint.setCitizenName(request.citizenName());
        complaint.setMobileNumber(request.mobileNumber());
        complaint.setSubjectTa(resolveSubject(request.subject(), analysis.summaryTa()));
        complaint.setDescriptionTa(request.description());
        complaint.setTranscriptTa(analysis.cleanedText());
        complaint.setVillage(blankFallback(request.village(), "கிராமம் குறிப்பிடப்படவில்லை"));
        complaint.setDistrict(blankFallback(request.district(), "மாவட்டம் குறிப்பிடப்படவில்லை"));
        complaint.setLocationArea(blankFallback(request.locationArea(), "இடம் குறிப்பிடப்படவில்லை"));
        complaint.setEvidenceUrl(request.evidenceUrl());
        complaint.setSourceMode(blankFallback(request.sourceMode(), "VOICE"));
        complaint.setCategoryCode(analysis.categoryCode());
        complaint.setCategoryLabelTa(analysis.categoryLabelTa());
        complaint.setDepartmentCode(analysis.departmentCode());
        complaint.setDepartmentLabelTa(analysis.departmentLabelTa());
        complaint.setStatus(ComplaintStatus.ROUTED);
        complaint.setPriority(analysis.priority());
        complaint.setConfidenceScore(analysis.confidence());
        complaint.setAssignedOfficerTa(resolveOfficer(analysis.priority()));

        Complaint saved = complaintRepository.save(complaint);

        addHistory(saved, ComplaintStatus.REGISTERED, "குறை பதிவு செய்யப்பட்டது", "உங்கள் குறை வெற்றிகரமாக பெறப்பட்டது", "முறைமை");
        addHistory(saved, ComplaintStatus.ROUTED, "துறைக்கு அனுப்பப்பட்டது", analysis.departmentLabelTa() + " துறைக்கு இந்த குறை அனுப்பப்பட்டது", "முறைமை");

        createNotification(saved.getMobileNumber(),
                "குறை பதிவு வெற்றி",
                saved.getReferenceNumber() + " என்ற எண்ணில் உங்கள் குறை பதிவு செய்யப்பட்டது",
                saved.getReferenceNumber());

        return toResponse(saved);
    }

    public ComplaintResponse createComplaint(ComplaintCreateRequest request, User user) {
        ComplaintCreateRequest ownedRequest = request;
        if (user.getRole() == UserRole.CITIZEN) {
            ownedRequest = new ComplaintCreateRequest(
                    blankFallback(user.getFullName(), user.getUsername()),
                    blankFallback(user.getMobileNumber(), request.mobileNumber()),
                    request.subject(),
                    request.description(),
                    request.transcript(),
                    blankFallback(request.village(), user.getVillage()),
                    blankFallback(request.district(), user.getDistrict()),
                    request.locationArea(),
                    request.evidenceUrl(),
                    request.sourceMode()
            );
        }
        ComplaintResponse created = createComplaint(ownedRequest);
        Complaint saved = findComplaint(created.id());
        saved.setOwnerUsername(user.getUsername());
        return toResponse(complaintRepository.save(saved));
    }

    public ComplaintResponse getComplaint(Long id) {
        return toResponse(findComplaint(id));
    }

    public ComplaintResponse getComplaint(Long id, User user) {
        Complaint complaint = findComplaint(id);
        requireAccess(complaint, user);
        return toResponse(complaint);
    }

    public ComplaintResponse updateComplaint(Long id, ComplaintUpdateRequest request) {
        Complaint complaint = findComplaint(id);
        ComplaintStatus newStatus = request.status() == null || request.status().isBlank()
                ? complaint.getStatus()
                : ComplaintStatus.valueOf(request.status());

        complaint.setStatus(newStatus);
        if (request.resolutionNote() != null && !request.resolutionNote().isBlank()) {
            complaint.setResolutionNoteTa(request.resolutionNote());
        }

        if (newStatus == ComplaintStatus.ESCALATED && complaint.getPriority() != PriorityLevel.CRITICAL) {
            complaint.setPriority(PriorityLevel.HIGH);
        }

        Complaint saved = complaintRepository.save(complaint);
        addHistory(
                saved,
                newStatus,
                statusTitle(newStatus),
                blankFallback(request.note(), "நிலை மாற்றம் செய்யப்பட்டு பதிவு செய்யப்பட்டது"),
                blankFallback(request.actorName(), "அலுவலர்")
        );
        createNotification(
                saved.getMobileNumber(),
                "குறை நிலை மாற்றம்",
                saved.getReferenceNumber() + " குறையின் நிலை " + statusTitle(newStatus) + " என மாற்றப்பட்டது",
                saved.getReferenceNumber()
        );
        return toResponse(saved);
    }

    public ComplaintResponse updateComplaint(Long id, ComplaintUpdateRequest request, User user) {
        if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.OFFICER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only administration can update complaint status");
        }
        return updateComplaint(id, request);
    }

    public List<AppNotification> getNotifications(String mobileNumber) {
        return notificationRepository.findByMobileNumberOrderByCreatedAtDesc(mobileNumber);
    }

    public List<TimelineItemResponse> getTimeline(Long complaintId) {
        Complaint complaint = findComplaint(complaintId);
        return complaintHistoryRepository.findByComplaintOrderByCreatedAtAsc(complaint)
                .stream()
                .map(history -> new TimelineItemResponse(
                        history.getId(),
                        history.getTitleTa(),
                        history.getNoteTa(),
                        history.getActorNameTa(),
                        history.getStatus().name(),
                        history.getCreatedAt()
                ))
                .toList();
    }

    public List<TimelineItemResponse> getTimeline(Long complaintId, User user) {
        Complaint complaint = findComplaint(complaintId);
        requireAccess(complaint, user);
        return getTimeline(complaintId);
    }

    private void requireAccess(Complaint complaint, User user) {
        if (user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.OFFICER) {
            return;
        }
        boolean ownsByUsername = user.getUsername().equals(complaint.getOwnerUsername());
        boolean ownsByMobile = user.getMobileNumber() != null && user.getMobileNumber().equals(complaint.getMobileNumber());
        if (!ownsByUsername && !ownsByMobile) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Complaint belongs to another user");
        }
    }

    private Complaint findComplaint(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "குறை கிடைக்கவில்லை"));
    }

    private ComplaintResponse toResponse(Complaint complaint) {
        return new ComplaintResponse(
                complaint.getId(),
                complaint.getReferenceNumber(),
                complaint.getOwnerUsername(),
                complaint.getCitizenName(),
                complaint.getMobileNumber(),
                complaint.getSubjectTa(),
                complaint.getDescriptionTa(),
                complaint.getTranscriptTa(),
                complaint.getLocationArea(),
                complaint.getVillage(),
                complaint.getDistrict(),
                complaint.getSourceMode(),
                complaint.getCategoryCode(),
                complaint.getCategoryLabelTa(),
                complaint.getDepartmentCode(),
                complaint.getDepartmentLabelTa(),
                complaint.getAssignedOfficerTa(),
                complaint.getStatus().name(),
                complaint.getPriority().name(),
                complaint.getConfidenceScore(),
                complaint.getResolutionNoteTa(),
                complaint.getEvidenceUrl(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt(),
                getTimeline(complaint.getId())
        );
    }

    private void addHistory(Complaint complaint, ComplaintStatus status, String titleTa, String noteTa, String actorNameTa) {
        ComplaintHistory history = new ComplaintHistory();
        history.setComplaint(complaint);
        history.setStatus(status);
        history.setTitleTa(titleTa);
        history.setNoteTa(noteTa);
        history.setActorNameTa(actorNameTa);
        complaintHistoryRepository.save(history);
    }

    private void createNotification(String mobileNumber, String titleTa, String messageTa, String referenceNumber) {
        AppNotification notification = new AppNotification();
        notification.setMobileNumber(mobileNumber);
        notification.setTitleTa(titleTa);
        notification.setMessageTa(messageTa);
        notification.setReferenceNumber(referenceNumber);
        notification.setReadFlag(false);
        notificationRepository.save(notification);
    }

    private String resolveSubject(String subject, String summary) {
        if (subject != null && !subject.isBlank()) {
            return subject;
        }
        return summary.length() > 40 ? summary.substring(0, 40) : summary;
    }

    private String resolveOfficer(PriorityLevel priorityLevel) {
        return switch (priorityLevel) {
            case CRITICAL -> "அவசர செயல்பாட்டு அலுவலர்";
            case HIGH -> "மண்டல ஆய்வு அலுவலர்";
            case MEDIUM -> "பகுதி சேவை அலுவலர்";
            case LOW -> "உதவி நிர்வாக அலுவலர்";
        };
    }

    private String statusTitle(ComplaintStatus status) {
        return switch (status) {
            case REGISTERED -> "குறை பதிவு செய்யப்பட்டது";
            case ROUTED -> "துறைக்கு அனுப்பப்பட்டது";
            case IN_PROGRESS -> "செயலில் உள்ளது";
            case FIELD_VISIT -> "தள ஆய்வு நடைபெறுகிறது";
            case RESOLVED -> "தீர்வு வழங்கப்பட்டது";
            case ESCALATED -> "மேல்நிலைக்கு உயர்த்தப்பட்டது";
            case CLOSED -> "மூடப்பட்டது";
        };
    }

    private String blankFallback(String input, String fallback) {
        return input == null || input.isBlank() ? fallback : input;
    }
}
