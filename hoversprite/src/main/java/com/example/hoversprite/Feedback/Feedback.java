package com.example.hoversprite.Feedback;

import jakarta.persistence.*;


@Entity
@Table(schema = "hoversprite", name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedbackId;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "attentive_rating")
    private Integer attentiveRating;

    @Column(name = "friendly_rating")
    private Integer friendlyRating;

    @Column(name = "professional_rating")
    private Integer professionalRating;

    @Column(name = "feedback")
    private String feedback;

    // Constructors
    public Feedback() {}

    public Feedback(Long orderId, Long userId, Integer attentiveRating, Integer friendlyRating, String feedback, Integer professionalRating) {
        this.orderId = orderId;
        this.userId = userId;
        this.attentiveRating = attentiveRating;
        this.friendlyRating = friendlyRating;
        this.feedback = feedback;
        this.professionalRating = professionalRating;
    }

    public Long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Long feedbackId) {
        this.feedbackId = feedbackId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getAttentiveRating() {
        return attentiveRating;
    }

    public void setAttentiveRating(Integer attentiveRating) {
        this.attentiveRating = attentiveRating;
    }

    public Integer getProfessionalRating() {
        return professionalRating;
    }

    public void setProfessionalRating(Integer professionalRating) {
        this.professionalRating = professionalRating;
    }

    public Integer getFriendlyRating() {
        return friendlyRating;
    }

    public void setFriendlyRating(Integer friendlyRating) {
        this.friendlyRating = friendlyRating;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    @Override
    public String toString() {
        return "Feedback{" +
                "feedbackId=" + feedbackId +
                ", orderId=" + orderId +
                ", userId=" + userId +
                ", attentiveRating=" + attentiveRating +
                ", friendlyRating=" + friendlyRating +
                ", professionalRating=" + professionalRating +
                ", feedback='" + feedback + '\'' +
                '}';
    }
}

