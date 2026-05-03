package org.gramavoice.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;

@Entity
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titleTa;

    @Lob
    private String contentTa;

    private String areaNameTa;
    private boolean active;
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

    public String getContentTa() {
        return contentTa;
    }

    public void setContentTa(String contentTa) {
        this.contentTa = contentTa;
    }

    public String getAreaNameTa() {
        return areaNameTa;
    }

    public void setAreaNameTa(String areaNameTa) {
        this.areaNameTa = areaNameTa;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
