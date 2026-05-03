package org.gramavoice.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.LocalDateTime;

@Entity
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String referenceNumber;
    private String citizenName;
    private String mobileNumber;
    private String subjectTa;

    @Lob
    private String descriptionTa;

    @Lob
    private String transcriptTa;

    private String locationArea;
    private String village;
    private String district;
    private String evidenceUrl;
    private String sourceMode;
    private String categoryCode;
    private String categoryLabelTa;
    private String departmentCode;
    private String departmentLabelTa;
    private String assignedOfficerTa;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status;

    @Enumerated(EnumType.STRING)
    private PriorityLevel priority;

    private Double confidenceScore;

    @Lob
    private String resolutionNoteTa;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getCitizenName() {
        return citizenName;
    }

    public void setCitizenName(String citizenName) {
        this.citizenName = citizenName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getSubjectTa() {
        return subjectTa;
    }

    public void setSubjectTa(String subjectTa) {
        this.subjectTa = subjectTa;
    }

    public String getDescriptionTa() {
        return descriptionTa;
    }

    public void setDescriptionTa(String descriptionTa) {
        this.descriptionTa = descriptionTa;
    }

    public String getTranscriptTa() {
        return transcriptTa;
    }

    public void setTranscriptTa(String transcriptTa) {
        this.transcriptTa = transcriptTa;
    }

    public String getLocationArea() {
        return locationArea;
    }

    public void setLocationArea(String locationArea) {
        this.locationArea = locationArea;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getEvidenceUrl() {
        return evidenceUrl;
    }

    public void setEvidenceUrl(String evidenceUrl) {
        this.evidenceUrl = evidenceUrl;
    }

    public String getSourceMode() {
        return sourceMode;
    }

    public void setSourceMode(String sourceMode) {
        this.sourceMode = sourceMode;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getCategoryLabelTa() {
        return categoryLabelTa;
    }

    public void setCategoryLabelTa(String categoryLabelTa) {
        this.categoryLabelTa = categoryLabelTa;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getDepartmentLabelTa() {
        return departmentLabelTa;
    }

    public void setDepartmentLabelTa(String departmentLabelTa) {
        this.departmentLabelTa = departmentLabelTa;
    }

    public String getAssignedOfficerTa() {
        return assignedOfficerTa;
    }

    public void setAssignedOfficerTa(String assignedOfficerTa) {
        this.assignedOfficerTa = assignedOfficerTa;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }

    public PriorityLevel getPriority() {
        return priority;
    }

    public void setPriority(PriorityLevel priority) {
        this.priority = priority;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getResolutionNoteTa() {
        return resolutionNoteTa;
    }

    public void setResolutionNoteTa(String resolutionNoteTa) {
        this.resolutionNoteTa = resolutionNoteTa;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
