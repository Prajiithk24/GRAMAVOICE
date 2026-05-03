package org.gramavoice.backend.controller;

import org.gramavoice.backend.model.Announcement;
import org.gramavoice.backend.model.FaqItem;
import org.gramavoice.backend.model.KnowledgeArticle;
import org.gramavoice.backend.repository.AnnouncementRepository;
import org.gramavoice.backend.repository.FaqItemRepository;
import org.gramavoice.backend.repository.KnowledgeArticleRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final AnnouncementRepository announcementRepository;
    private final FaqItemRepository faqItemRepository;
    private final KnowledgeArticleRepository knowledgeArticleRepository;

    public ContentController(
            AnnouncementRepository announcementRepository,
            FaqItemRepository faqItemRepository,
            KnowledgeArticleRepository knowledgeArticleRepository
    ) {
        this.announcementRepository = announcementRepository;
        this.faqItemRepository = faqItemRepository;
        this.knowledgeArticleRepository = knowledgeArticleRepository;
    }

    @GetMapping("/announcements")
    public List<Announcement> announcements() {
        return announcementRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    @GetMapping("/faqs")
    public List<FaqItem> faqs() {
        return faqItemRepository.findAllByOrderByDisplayOrderAsc();
    }

    @GetMapping("/articles")
    public List<KnowledgeArticle> articles() {
        return knowledgeArticleRepository.findAll();
    }
}
