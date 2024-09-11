package com.example.hoversprite.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendStatusUpdateEmail(String farmerEmail, String status) {
        System.out.println("Sending email to farmer: " + farmerEmail + " with status: " + status);
    }

    public void sendSprayerStatusEmail(String sprayerEmail, String status) {
        System.out.println("Sending email to sprayer: " + sprayerEmail + " with status: " + status);
    }
}
