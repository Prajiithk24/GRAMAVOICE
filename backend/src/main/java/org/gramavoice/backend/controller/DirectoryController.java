package org.gramavoice.backend.controller;

import org.gramavoice.backend.model.CategoryRule;
import org.gramavoice.backend.model.Department;
import org.gramavoice.backend.model.UserAccount;
import org.gramavoice.backend.model.UserRole;
import org.gramavoice.backend.repository.CategoryRuleRepository;
import org.gramavoice.backend.repository.DepartmentRepository;
import org.gramavoice.backend.repository.UserAccountRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/directory")
public class DirectoryController {

    private final DepartmentRepository departmentRepository;
    private final CategoryRuleRepository categoryRuleRepository;
    private final UserAccountRepository userAccountRepository;

    public DirectoryController(
            DepartmentRepository departmentRepository,
            CategoryRuleRepository categoryRuleRepository,
            UserAccountRepository userAccountRepository
    ) {
        this.departmentRepository = departmentRepository;
        this.categoryRuleRepository = categoryRuleRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @GetMapping("/departments")
    public List<Department> departments() {
        return departmentRepository.findAll();
    }

    @GetMapping("/categories")
    public List<CategoryRule> categories() {
        return categoryRuleRepository.findAll();
    }

    @GetMapping("/users")
    public List<UserAccount> users(@RequestParam(defaultValue = "CITIZEN") String role) {
        return userAccountRepository.findByRole(UserRole.valueOf(role));
    }
}
