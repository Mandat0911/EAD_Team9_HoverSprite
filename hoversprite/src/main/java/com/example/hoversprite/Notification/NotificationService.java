package com.example.hoversprite.Notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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


    public Page<Notification> getNotificationsByUserId(Long userId, int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return notificationRepository.findByUserId(userId, pageable);
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
