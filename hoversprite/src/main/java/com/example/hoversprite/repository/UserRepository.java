package com.example.hoversprite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.hoversprite.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.phone = ?1 OR u.email = ?1")
    public User findByPhoneOrEmail(String phoneOrEmail);
}
