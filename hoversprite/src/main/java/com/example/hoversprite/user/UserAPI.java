package com.example.hoversprite.user;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserAPI {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserDetailService userDetailService;

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

    @GetMapping("/by-phone/{phone}")
    public ResponseEntity<User> getFarmerByPhone(@PathVariable String phone) {
        User farmer = userDetailService.findByPhone(phone);
        if (farmer != null) {
            return new ResponseEntity<>(farmer, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Return 404 if not found
        }
    }
}
