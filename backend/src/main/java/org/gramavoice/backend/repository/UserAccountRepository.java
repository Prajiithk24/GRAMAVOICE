package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.UserAccount;
import org.gramavoice.backend.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    List<UserAccount> findByRole(UserRole role);
}
