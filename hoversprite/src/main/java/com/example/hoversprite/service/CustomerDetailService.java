package com.example.hoversprite.service;


import com.example.hoversprite.model.Role;
import com.example.hoversprite.model.User;
import com.example.hoversprite.repository.RoleRepository;
import com.example.hoversprite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class CustomerDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@hoversprite\\.(com|com\\.vn)$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByPhoneOrEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return user;
    }
    public boolean userExists(String phoneOrEmail) {
        return userRepository.findByPhoneOrEmail(phoneOrEmail) != null;
    }

    public void registerUser(User user) throws Exception {
        // Check if phone number or email already exists
        if (userExists(user.getPhone()) || userExists(user.getEmail())) {
            throw new Exception("Phone number or email already exists");
        }
        if (!isValidEmail(user.getEmail())) {
            throw new Exception("Email must be from domain @hoversprite.com or @hoversprite.com.vn");
        }
        // Encrypt password
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        Role roleUSer = roleRepository.findByName("Farmer");
        user.addRole(roleUSer);

        // Save user
        userRepository.save(user);
    }
    private boolean isValidEmail(String email) {
        return EMAIL_PATTERN.matcher(email).matches();
    }

    public User get(Long id){
        return userRepository.findById(id).get();
    }

    public void save(User user) throws Exception {
        // Validate the email domain
        if (!isValidEmail(user.getEmail())) {
            throw new Exception("Email must be from domain @hoversprite.com or @hoversprite.com.vn");
        }

        // Encode the password before saving
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        // Save the user to the repository
        userRepository.save(user);
    }
}