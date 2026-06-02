package org.gramavoice.backend.controller;

import org.gramavoice.backend.dto.DashboardResponse;
import org.gramavoice.backend.model.User;
import org.gramavoice.backend.model.UserRole;
import org.gramavoice.backend.service.DashboardService;
import org.gramavoice.backend.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService userService;

    public DashboardController(DashboardService dashboardService, UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @GetMapping("/home")
    public DashboardResponse home(Principal principal) {
        User user = userService.getByUsername(principal.getName());
        return user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.OFFICER
                ? dashboardService.admin()
                : dashboardService.citizen(user.getMobileNumber());
    }

    @GetMapping("/citizen")
    public DashboardResponse citizen(Principal principal) {
        User user = userService.getByUsername(principal.getName());
        return dashboardService.citizen(user.getMobileNumber());
    }

    @GetMapping("/admin")
    public DashboardResponse admin() {
        return dashboardService.admin();
    }
}
