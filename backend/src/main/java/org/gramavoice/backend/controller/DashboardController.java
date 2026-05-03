package org.gramavoice.backend.controller;

import org.gramavoice.backend.dto.DashboardResponse;
import org.gramavoice.backend.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/home")
    public DashboardResponse home() {
        return dashboardService.home();
    }

    @GetMapping("/citizen")
    public DashboardResponse citizen(@RequestParam(defaultValue = "9876543210") String mobileNumber) {
        return dashboardService.citizen(mobileNumber);
    }

    @GetMapping("/admin")
    public DashboardResponse admin() {
        return dashboardService.admin();
    }
}
