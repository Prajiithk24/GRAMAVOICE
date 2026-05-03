package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.AppNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppNotificationRepository extends JpaRepository<AppNotification, Long> {
    List<AppNotification> findByMobileNumberOrderByCreatedAtDesc(String mobileNumber);
}
