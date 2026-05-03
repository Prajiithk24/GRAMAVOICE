package org.gramavoice.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Department {

    @Id
    private String code;

    private String nameTa;
    private String district;
    private String contactNumber;
    private Integer slaHours;
    private String descriptionTa;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNameTa() {
        return nameTa;
    }

    public void setNameTa(String nameTa) {
        this.nameTa = nameTa;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public Integer getSlaHours() {
        return slaHours;
    }

    public void setSlaHours(Integer slaHours) {
        this.slaHours = slaHours;
    }

    public String getDescriptionTa() {
        return descriptionTa;
    }

    public void setDescriptionTa(String descriptionTa) {
        this.descriptionTa = descriptionTa;
    }
}
