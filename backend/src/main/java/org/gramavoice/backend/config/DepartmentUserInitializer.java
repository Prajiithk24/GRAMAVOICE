package org.gramavoice.backend.config;

import org.gramavoice.backend.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DepartmentUserInitializer implements CommandLineRunner {

    private final UserService userService;

    public DepartmentUserInitializer(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        userService.initializeDepartmentUsers();
    }
}
