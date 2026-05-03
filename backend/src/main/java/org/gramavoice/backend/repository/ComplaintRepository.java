package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.Complaint;
import org.gramavoice.backend.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByMobileNumberOrderByCreatedAtDesc(String mobileNumber);
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
}
