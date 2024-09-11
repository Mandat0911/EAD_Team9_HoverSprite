package com.example.hoversprite.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.hoversprite.model.Notification;
import com.example.hoversprite.service.NotificationService;

@Controller
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public String listNotifications(Model model) {
        model.addAttribute("notifications", notificationService.getAllNotifications());
        return "notifications";
    }

    @GetMapping("/details/{id}")
    public String viewNotificationDetails(@PathVariable("id") Long id, Model model) {
        Optional<Notification> notification = notificationService.getNotificationById(id);
        if (notification.isPresent()) {
            model.addAttribute("notification", notification.get());
            return "notificationDetails";
        } else {
            // Handle notification not found
            return "error";
        }
    }
}
