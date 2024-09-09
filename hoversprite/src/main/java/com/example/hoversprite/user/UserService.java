package com.example.hoversprite.user;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

public class UserService {
    @Autowired
    private UserRepository userRepository;

    // Get user by ID
    User getUserById(long id) {
        return userRepository.findById(id);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Create a new user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Update an existing user
    public User updateUser(User user) {
        // Save will update the user if it exists
        return userRepository.save(user);
    }

    // Delete a user by ID
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
}
