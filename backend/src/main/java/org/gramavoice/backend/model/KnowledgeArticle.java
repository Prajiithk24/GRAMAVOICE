package org.gramavoice.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;

@Entity
public class KnowledgeArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titleTa;
    private String summaryTa;

    @Column(columnDefinition = "TEXT")
    private String contentTa;

    private String audienceTa;
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getTitleTa() {
        return titleTa;
    }

    public void setTitleTa(String titleTa) {
        this.titleTa = titleTa;
    }

    public String getSummaryTa() {
        return summaryTa;
    }

    public void setSummaryTa(String summaryTa) {
        this.summaryTa = summaryTa;
    }

    public String getContentTa() {
        return contentTa;
    }

    public void setContentTa(String contentTa) {
        this.contentTa = contentTa;
    }

    public String getAudienceTa() {
        return audienceTa;
    }

    public void setAudienceTa(String audienceTa) {
        this.audienceTa = audienceTa;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
