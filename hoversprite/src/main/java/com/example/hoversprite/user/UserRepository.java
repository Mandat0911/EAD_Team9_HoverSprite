package com.example.hoversprite.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.phone = ?1 OR u.email = ?1")
     User findByPhoneOrEmail(String phoneOrEmail);

    User findByEmail(String email);
}
