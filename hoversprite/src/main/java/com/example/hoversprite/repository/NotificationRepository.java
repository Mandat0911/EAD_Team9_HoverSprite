package com.example.hoversprite.repository;

import com.example.hoversprite.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Custom query methods (if needed) can be defined here
}