package com.example.hoversprite.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.phone = ?1 OR u.email = ?1")
    User findByPhoneOrEmail(String phoneOrEmail);

    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = ?1 OR u.phone = ?2")
    User findByEmailOrPhone(String email, String phone);

    @Query("UPDATE User u SET u.enabled = true WHERE u.id =?1")
    @Modifying
    public void enable(Long id);

    @Query("SELECT u FROM User u WHERE u.verificationCode = ?1")
    public User findByVerificationCode(String code);

    User findByPhone(String phone);
}
