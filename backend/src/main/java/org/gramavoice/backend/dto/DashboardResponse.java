package org.gramavoice.backend.dto;

import java.util.List;

public record DashboardResponse(
        String titleTa,
        String subtitleTa,
        List<DashboardCardResponse> cards,
        List<ChartPointResponse> statusChart,
        List<ChartPointResponse> categoryChart,
        List<ComplaintResponse> recentComplaints
) {
}
