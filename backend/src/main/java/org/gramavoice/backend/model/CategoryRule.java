package org.gramavoice.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class CategoryRule {

    @Id
    private String code;

    private String nameTa;
    private String departmentCode;
    private String departmentNameTa;

    @Lob
    private String keywordsTa;

    private String priorityCode;

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

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getDepartmentNameTa() {
        return departmentNameTa;
    }

    public void setDepartmentNameTa(String departmentNameTa) {
        this.departmentNameTa = departmentNameTa;
    }

    public String getKeywordsTa() {
        return keywordsTa;
    }

    public void setKeywordsTa(String keywordsTa) {
        this.keywordsTa = keywordsTa;
    }

    public String getPriorityCode() {
        return priorityCode;
    }

    public void setPriorityCode(String priorityCode) {
        this.priorityCode = priorityCode;
    }
}
