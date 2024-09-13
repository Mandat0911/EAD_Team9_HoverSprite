package com.example.hoversprite.Notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    @Autowired
    NotificationRepository notificationRepository;


    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }


    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }


    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }



    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }


    public Notification updateNotification(Long id, Notification notification) {
        if (notificationRepository.existsById(id)) {
            notification.setNotificationId(id);
            return notificationRepository.save(notification);
        }
        throw new RuntimeException("Notification not found with id: " + id);
    }


    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
