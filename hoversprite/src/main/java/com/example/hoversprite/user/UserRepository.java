package com.example.hoversprite.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.phone = ?1 OR u.email = ?1")
     User findByPhoneOrEmail(String phoneOrEmail);

    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = ?1 OR u.phone = ?2")
    User findByEmailOrPhone(String email, String phone);
}
