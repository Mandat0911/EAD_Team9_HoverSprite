package com.example.hoversprite.controllers;

import com.example.hoversprite.model.User;
import com.example.hoversprite.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserAPI {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority(\"RECEPTIONIST\")")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority(\"RECEPTIONIST\")")
    public ResponseEntity<User> createUser(@RequestBody @Valid User user){
        User savedUser = userRepository.save(user);
        URI userURI = URI.create("/users/" + savedUser.getId());
        return ResponseEntity.created(userURI).body(savedUser);
    }
}
