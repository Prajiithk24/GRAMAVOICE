package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.Complaint;
import org.gramavoice.backend.model.ComplaintHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintHistoryRepository extends JpaRepository<ComplaintHistory, Long> {
    List<ComplaintHistory> findByComplaintOrderByCreatedAtAsc(Complaint complaint);
}
