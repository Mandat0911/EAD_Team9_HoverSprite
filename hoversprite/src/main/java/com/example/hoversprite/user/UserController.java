package com.example.hoversprite.user;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user")
public class UserController {
    
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    User getUserById(@PathVariable long id) {
        return userService.getUserById(id);
    }


    @GetMapping("/all")
    List<User> getAllUsers() {
        return userService.getAllUsers(); 
    }

    @PostMapping
    User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Update a user by ID
    @PutMapping("/{id}")
    public User updateUser(@PathVariable long id, @RequestBody User user) {
        user.setId(id);  // Set the ID from the path to ensure consistency
        return userService.updateUser(user);
    }

    // Delete a user by ID
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return "User with ID " + id + " deleted successfully";
    }
}
