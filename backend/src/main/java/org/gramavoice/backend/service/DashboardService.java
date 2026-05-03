package org.gramavoice.backend.service;

import org.gramavoice.backend.dto.ChartPointResponse;
import org.gramavoice.backend.dto.ComplaintResponse;
import org.gramavoice.backend.dto.DashboardCardResponse;
import org.gramavoice.backend.dto.DashboardResponse;
import org.gramavoice.backend.model.AppNotification;
import org.gramavoice.backend.model.CategoryRule;
import org.gramavoice.backend.model.Complaint;
import org.gramavoice.backend.model.ComplaintStatus;
import org.gramavoice.backend.repository.AppNotificationRepository;
import org.gramavoice.backend.repository.CategoryRuleRepository;
import org.gramavoice.backend.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ComplaintRepository complaintRepository;
    private final AppNotificationRepository notificationRepository;
    private final CategoryRuleRepository categoryRuleRepository;
    private final ComplaintService complaintService;

    public DashboardService(
            ComplaintRepository complaintRepository,
            AppNotificationRepository notificationRepository,
            CategoryRuleRepository categoryRuleRepository,
            ComplaintService complaintService
    ) {
        this.complaintRepository = complaintRepository;
        this.notificationRepository = notificationRepository;
        this.categoryRuleRepository = categoryRuleRepository;
        this.complaintService = complaintService;
    }

    public DashboardResponse home() {
        List<Complaint> complaints = complaintRepository.findAll();
        return buildResponse(
                "கிராம குரல் குறைதீர் தளம்",
                "தமிழில் பேசுங்கள். குறையை பதிவு செய்யுங்கள். நிலையை தொடர்ந்து அறியுங்கள்.",
                complaints,
                complaintRepository.findAll().stream().sorted(Comparator.comparing(Complaint::getCreatedAt).reversed()).limit(5).map(Complaint::getId).map(complaintService::getComplaint).toList()
        );
    }

    public DashboardResponse citizen(String mobileNumber) {
        List<Complaint> complaints = complaintRepository.findByMobileNumberOrderByCreatedAtDesc(mobileNumber);
        List<AppNotification> notifications = notificationRepository.findByMobileNumberOrderByCreatedAtDesc(mobileNumber);

        List<DashboardCardResponse> cards = List.of(
                new DashboardCardResponse("மொத்த குறைகள்", String.valueOf(complaints.size()), "உங்கள் பெயரில் பதிவு செய்யப்பட்டவை"),
                new DashboardCardResponse("தீர்வு பெற்றவை", String.valueOf(countByStatus(complaints, ComplaintStatus.RESOLVED)), "முடிக்கப்பட்ட சேவை குறைகள்"),
                new DashboardCardResponse("செயலில் உள்ளவை", String.valueOf(activeCount(complaints)), "இன்னும் நடவடிக்கையில் உள்ளவை"),
                new DashboardCardResponse("புதிய அறிவிப்புகள்", String.valueOf(notifications.stream().filter(notification -> !notification.isReadFlag()).count()), "உங்களுக்கான சமீபத்திய தகவல்கள்")
        );

        return new DashboardResponse(
                "குடிமக்கள் பலகை",
                "உங்கள் குறைகள், அறிவிப்புகள், மற்றும் தற்போதைய நிலைகள் ஒரே இடத்தில்",
                cards,
                statusChart(complaints),
                categoryChart(complaints),
                complaints.stream().limit(6).map(complaint -> complaintService.getComplaint(complaint.getId())).toList()
        );
    }

    public DashboardResponse admin() {
        List<Complaint> complaints = complaintRepository.findAll();
        return buildResponse(
                "நிர்வாக கண்காணிப்பு பலகை",
                "துறை வாரியான அழுத்தம், செயல்திறன், மற்றும் அவசர நிலை கண்காணிப்பு",
                complaints,
                complaints.stream()
                        .sorted(Comparator.comparing(Complaint::getCreatedAt).reversed())
                        .limit(8)
                        .map(complaint -> complaintService.getComplaint(complaint.getId()))
                        .toList()
        );
    }

    private DashboardResponse buildResponse(String title, String subtitle, List<Complaint> complaints, List<ComplaintResponse> recentComplaints) {
        List<DashboardCardResponse> cards = List.of(
                new DashboardCardResponse("மொத்த குறைகள்", String.valueOf(complaints.size()), "அனைத்து பதிவு எண்ணிக்கையும்"),
                new DashboardCardResponse("தீர்வு பெற்றவை", String.valueOf(countByStatus(complaints, ComplaintStatus.RESOLVED)), "முடிக்கப்பட்ட மற்றும் உறுதிப்படுத்தப்பட்டவை"),
                new DashboardCardResponse("அவசர குறைகள்", String.valueOf(complaints.stream().filter(complaint -> "CRITICAL".equals(complaint.getPriority().name()) || "HIGH".equals(complaint.getPriority().name())).count()), "உடனடி கவனம் தேவைப்படுபவை"),
                new DashboardCardResponse("செயலில் உள்ளவை", String.valueOf(activeCount(complaints)), "தற்போது பணியில் உள்ளவை")
        );

        return new DashboardResponse(title, subtitle, cards, statusChart(complaints), categoryChart(complaints), recentComplaints);
    }

    private List<ChartPointResponse> statusChart(List<Complaint> complaints) {
        Map<String, Long> counts = complaints.stream()
                .collect(Collectors.groupingBy(complaint -> switch (complaint.getStatus()) {
                    case REGISTERED -> "பதிவு";
                    case ROUTED -> "ஒதுக்கல்";
                    case IN_PROGRESS -> "செயலில்";
                    case FIELD_VISIT -> "தள ஆய்வு";
                    case RESOLVED -> "தீர்வு";
                    case ESCALATED -> "உயர்த்தல்";
                    case CLOSED -> "மூடல்";
                }, Collectors.counting()));

        return counts.entrySet().stream()
                .map(entry -> new ChartPointResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<ChartPointResponse> categoryChart(List<Complaint> complaints) {
        Map<String, Long> counts = complaints.stream()
                .collect(Collectors.groupingBy(Complaint::getCategoryLabelTa, Collectors.counting()));

        if (counts.isEmpty()) {
            return categoryRuleRepository.findAll().stream()
                    .map(CategoryRule::getNameTa)
                    .limit(5)
                    .map(label -> new ChartPointResponse(label, 0))
                    .toList();
        }

        return counts.entrySet().stream()
                .map(entry -> new ChartPointResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    private long countByStatus(List<Complaint> complaints, ComplaintStatus status) {
        return complaints.stream().filter(complaint -> complaint.getStatus() == status).count();
    }

    private long activeCount(List<Complaint> complaints) {
        return complaints.stream()
                .filter(complaint -> complaint.getStatus() != ComplaintStatus.RESOLVED && complaint.getStatus() != ComplaintStatus.CLOSED)
                .count();
    }
}
