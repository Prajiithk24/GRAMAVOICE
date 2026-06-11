package org.gramavoice.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Id;

@Entity
public class FaqItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String questionTa;

    @Column(columnDefinition = "TEXT")
    private String answerTa;

    private Integer displayOrder;

    public Long getId() {
        return id;
    }

    public String getQuestionTa() {
        return questionTa;
    }

    public void setQuestionTa(String questionTa) {
        this.questionTa = questionTa;
    }

    public String getAnswerTa() {
        return answerTa;
    }

    public void setAnswerTa(String answerTa) {
        this.answerTa = answerTa;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
