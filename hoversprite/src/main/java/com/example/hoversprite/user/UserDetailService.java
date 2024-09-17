package com.example.hoversprite.user;


import com.example.hoversprite.oauthAPI.AuthenticationProvider;
import com.example.hoversprite.Role.Role;
import com.example.hoversprite.Role.RoleRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;

@Service
public class UserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private JavaMailSender javaMailSender;
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

    public User registerUser(User user) throws Exception {
        // Check if phone number or email already exists
        if (userExists(user.getPhone()) || userExists(user.getEmail())) {
            throw new Exception("Phone number or email already exists");
        }
//        if (!isValidEmail(user.getEmail())) {
//            throw new Exception("Email must be from domain @hoversprite.com or @hoversprite.com.vn");
//        }
        // Encrypt password
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        String randomCode = RandomString.make(64);
        user.setVerificationCode(randomCode);

        Role roleUSer = roleRepository.findByName("Farmer");
        user.addRole(roleUSer);
        user.setAuthenticationProvider(AuthenticationProvider.LOCAL);
        // Save user
        return userRepository.save(user);

    }

    public void sendVerificationEmail(User user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String subject = "Please verify your registration!";
        String senderName = "HoverSprite";
        String verifyURL = siteURL + "/verify?code=" + user.getVerificationCode();

        String mailContent = "<html>"
                + "<head>"
                + "<style>"
                + "body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f4f4f4; padding: 20px; }"
                + ".email-container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 10px; }"
                + ".email-header { background-color: #4CAF50; padding: 10px; text-align: center; color: #ffffff; border-top-left-radius: 10px; border-top-right-radius: 10px; }"
                + ".email-body { padding: 20px; }"
                + ".email-body h2 { color: #4CAF50; }"
                + ".email-body p { margin: 15px 0; font-size: 16px; }"
                + ".email-footer { margin-top: 20px; font-size: 0.9em; color: #777777; text-align: center; }"
                + ".verify-button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; }"
                + ".verify-button:hover { background-color: #45a049; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='email-container'>"
                + "  <div class='email-header'>"
                + "    <h1>Verify Your Email</h1>"
                + "  </div>"
                + "  <div class='email-body'>"
                + "    <p>Dear " + user.getFullName() + ",</p>"
                + "    <p>Thank you for registering with HoverSprite. Please click the button below to verify your email address and activate your account:</p>"
                + "    <p><a href=\"" + verifyURL + "\" class='verify-button'>VERIFY</a></p>"
                + "    <p>If the button doesn't work, you can also click the following link or copy it into your browser:</p>"
                + "    <p><a href=\"" + verifyURL + "\">" + verifyURL + "</a></p>"
                + "    <p>Thank you!<br>HoverSprite Team</p>"
                + "  </div>"
                + "  <div class='email-footer'>"
                + "    <p>&copy; 2024 HoverSprite. All rights reserved.</p>"
                + "  </div>"
                + "</div>"
                + "</body>"
                + "</html>";


        // Create and send email
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("nguyenmandat0744@gmail.com", senderName);  // Make sure this email is correctly configured in your mail properties
        helper.setTo(user.getEmail());
        helper.setSubject(subject);
        helper.setText(mailContent, true);  // Enable HTML content

        javaMailSender.send(message);
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
        // Validate the email domain if necessary
        if (!isValidEmail(user.getEmail())) {
            throw new Exception("Email must be from domain @hoversprite.com or @hoversprite.com.vn");
        }

        // Fetch existing user from the database
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new Exception("User not found"));

        // Update user details
        existingUser.setFirstName(user.getFirstName());
        existingUser.setMiddleName(user.getMiddleName());
        existingUser.setLastName(user.getLastName());
        existingUser.setPhone(user.getPhone());
        existingUser.setEmail(user.getEmail());
        existingUser.setAddress(user.getAddress());

        // Update the password only if it's not empty (i.e., the user changed it)
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            existingUser.setPassword(encodedPassword);
        }

        // Save the updated user to the repository
        userRepository.save(existingUser);
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

    public boolean verify(String verificationCode) {
        User user = userRepository.findByVerificationCode(verificationCode);

        if (user == null) {
            // Verification code doesn't match any user
            return false;
        }

        if (user.isEnabled()) {
            // User is already enabled (already verified)
            return false;
        }

        // Enable the user and save the updated state
        user.setEnabled(true);  // Set the user as enabled
        userRepository.save(user);  // Update the user in the database

        return true;
    }

    // Method to find a user by their ID
    public User findById(Long id) throws Exception {
        return userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + id));
    }

}