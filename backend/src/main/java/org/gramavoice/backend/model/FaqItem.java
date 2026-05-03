package org.gramavoice.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class FaqItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String questionTa;

    @Lob
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
