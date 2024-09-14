package com.example.hoversprite.User;


import com.example.hoversprite.oauthAPI.AuthenticationProvider;
import com.example.hoversprite.Role.Role;
import com.example.hoversprite.Role.RoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class UserDetailService implements UserDetailsService {

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
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);

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

    @Transactional
    public void createNewUserAfterOAuthLoginSuccess(String email, String name, AuthenticationProvider authenticationProvider) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser != null) {
            throw new RuntimeException("User with email " + email + " already exists");
        }
        User user = new User();
        user.setEmail(email);
        user.setFirstName(name);
        user.setEnabled(true);
        user.setAddress(email);  // Default value for address
        user.setAuthenticationProvider(authenticationProvider);
        user.setLastName("");  // Default value for last name
        user.setPassword("");  // Default value for password (you may want to handle this properly)
        user.setMiddleName("");  // Default value for middle name
        user.setPhone(email);  // Default value for phone

        // Fetch the role and ensure it is managed by the persistence context
        Role roleUser = roleRepository.findByName("FARMER");

        if (roleUser == null) {
            throw new RuntimeException("Role 'Farmer' not found");
        }
        // Log role information
        System.out.println("Role fetched: " + roleUser);

        // Add role to the user
        user.addRole(roleUser);

        userRepository.save(user);

        // Re-authenticate user to ensure roles are loaded in the session
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Transactional
    public void UpdateUserAfterOAuthLoginSuccess(User user, String name, AuthenticationProvider authenticationProvider) {
        // Update user details
        user.setFirstName(name);
        user.setAuthenticationProvider(authenticationProvider);

        // Log the update action
        System.out.println("Updating user with email: " + user.getEmail());

        // Save updated user
        userRepository.save(user);

        // Re-authenticate user to ensure roles are loaded in the session
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}