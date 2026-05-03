package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.KnowledgeArticle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, Long> {
}
