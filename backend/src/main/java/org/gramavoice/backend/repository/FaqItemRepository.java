package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.FaqItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaqItemRepository extends JpaRepository<FaqItem, Long> {
    List<FaqItem> findAllByOrderByDisplayOrderAsc();
}
