package com.example.hoversprite.Feedback;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    // Create
    public Feedback createFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    // Read (single feedback)
    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    // Read (all feedback)
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }



    // Additional utility methods

    // Find feedback by order ID
    public Feedback getFeedbackByOrderId(Long orderId) {
        return feedbackRepository.findByOrderId(orderId);
    }

}
