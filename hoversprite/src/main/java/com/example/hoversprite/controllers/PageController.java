package com.example.hoversprite.controllers;

import com.example.hoversprite.Role.RoleRepository;
import com.example.hoversprite.service.PasswordValidationService;
import com.example.hoversprite.user.*;

import java.security.Principal;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.hoversprite.Role.RoleRepository;
import com.example.hoversprite.service.PasswordValidationService;

@Controller
public class PageController implements ErrorController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserDetailService userDetailService;
    @Autowired
    private PasswordValidationService passwordValidationService;
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Home");
        model.addAttribute("content", "home");
        model.addAttribute("css", "/stylesheets/home.css");
        return "layout";
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("title", "Login");
        model.addAttribute("content", "login");
        model.addAttribute("css", "/stylesheets/login.css");
        model.addAttribute("js", "/js/login.js");
        return "layout";
    }

    @GetMapping("/register")
    public String showSignUpForm(Model model, @RequestParam(value = "error", required = false) String error) {
        model.addAttribute("title", "Register");
        model.addAttribute("content", "register");
        model.addAttribute("css", "/stylesheets/login.css");
        model.addAttribute("js", "/js/login.js");
        model.addAttribute("user", new User());
        if (error != null) {
            model.addAttribute("error", error);
        }
        return "layout";
    }

    @PostMapping("/process_register")
    public String processRegister(User user, RedirectAttributes redirectAttributes, HttpServletRequest request) {
        // Validate the password
        passwordValidationService.validatePassword(user.getPassword());

        try {
            userDetailService.registerUser(user);
            String siteURL = Utility.getSiteURL(request);
            userDetailService.sendVerificationEmail(user, siteURL);
            return "redirect:/announceUser";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/register";
        }
    }

    @GetMapping("/announceUser")
    public String announceVerifyUser(Model model, User user) {
        model.addAttribute("title", "Check Your Email");
        model.addAttribute("content", "announceVerifyUser");
        model.addAttribute("css", "/stylesheets/login.css");

        // Add authenticated user's email to the model, if applicable
//        model.addAttribute("user", user.getEmail()); // Assuming the principal's name is the email

        return "layout";
    }


    @GetMapping("/booking")
    @PreAuthorize("hasAnyAuthority(\"RECEPTIONIST\", \"FARMER\")")
    public String booking(Model model) {
        model.addAttribute("title", "Booking");
        model.addAttribute("content", "booking");
        model.addAttribute("css", "/stylesheets/booking.css");
        model.addAttribute("js", "/js/booking.js");
        return "layout";
    }

    @GetMapping("/orders")
    public String orders(@ModelAttribute("user") User user,Model model) {
        model.addAttribute("title", "Orders Management");
        model.addAttribute("content", "orders");
        model.addAttribute("css", "/stylesheets/orders.css");
        model.addAttribute("js", "/js/orders.js");
        return "layout";
    }

    @GetMapping("/orders/order_details")
    public String orderDetail(Model model) {
        model.addAttribute("title", "Order Details");
        model.addAttribute("content", "orderDetails");
        model.addAttribute("css", "/stylesheets/orderDetails.css");
        model.addAttribute("js", "/js/orderDetails.js");
        return "layout";
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority(\"RECEPTIONIST\")")
    public String users(Model model) {
        model.addAttribute("title", "Users Management");
        model.addAttribute("content", "users");
        model.addAttribute("css", "/stylesheets/users.css");
        model.addAttribute("js", "/js/users.js");

        List<User> listUsers = userRepository.findAll();
        model.addAttribute("listUsers", listUsers);
        return "layout";
    }

    @GetMapping("/account")
    public String account(Model model) {
        model.addAttribute("title", "Account");
        model.addAttribute("content", "userProfile"); // Load userProfile by default
        model.addAttribute("css", "/stylesheets/account.css");
        model.addAttribute("js", "/js/userProfile.js");
        return "layout";
    }

    // @GetMapping("/account/user_profile")
    // public String userProfile(Model model) {
    //     model.addAttribute("title", "User Profile");
    //     model.addAttribute("content", "userProfile");
    //     model.addAttribute("css", "/stylesheets/account.css");
    //     model.addAttribute("js", "/js/userProfile.js");
    //     return "layout";
    // }

    @GetMapping("/account/notifications")
    public String notifications(Model model) {
        model.addAttribute("title", "Notifications");
        model.addAttribute("content", "notifications");
        model.addAttribute("css", "/stylesheets/account.css");
        model.addAttribute("js", "/js/notifications.js");
        return "layout";
    }

    @GetMapping("/about")
    public String about(Model model) {
        model.addAttribute("title", "About Us");
        model.addAttribute("content", "about");
        model.addAttribute("css", "/stylesheets/about.css");
        return "layout";
    }

    @GetMapping("/faqs")
    public String faqs(Model model) {
        model.addAttribute("title", "FAQs");
        model.addAttribute("content", "faqs");
        model.addAttribute("css", "/stylesheets/faqs.css");
        return "layout";
    }

    @GetMapping("/copyright")
    public String copyright(Model model) {
        model.addAttribute("title", "Copyright");
        model.addAttribute("content", "copyright");
        model.addAttribute("css", "/stylesheets/copyright.css");
        return "layout";
    }

    @GetMapping("/terms")
    public String terms(Model model) {
        model.addAttribute("title", "Terms Of Service");
        model.addAttribute("content", "terms-of-service");
        model.addAttribute("css", "/stylesheets/terms-of-service.css");
        return "layout";
    }

    @GetMapping("/policy")
    public String policy(Model model) {
        model.addAttribute("title", "Privacy Policy");
        model.addAttribute("content", "privacy-policy");
        model.addAttribute("css", "/stylesheets/privacy-policy.css");
        return "layout";
    }

    @GetMapping("/error")
    public String handleError(Model model) {
        model.addAttribute("title", "404 Not Found");
        model.addAttribute("content", "404");
        return "layout";
    }

    @GetMapping("/account/edit/user/{id}")
    public String showEditUserForm(@PathVariable Long id, Model model) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user Id:" + id));
        model.addAttribute("user", user);
        model.addAttribute("title", "Edit User");
        model.addAttribute("content", "editUser");
        model.addAttribute("css", "/stylesheets/booking.css");
        model.addAttribute("js", "/js/booking.js");
        return "layout";
    }

    @PostMapping("/account/update")
    public String saveUser(@ModelAttribute("user") User user, RedirectAttributes redirectAttributes) {
//        System.out.println("User details: " + user.toString());
        try {
            userDetailService.save(user);
            redirectAttributes.addFlashAttribute("message", "User saved successfully!");
            return "redirect:/account";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/account/edit/user/" + user.getId();
        }
    }

    @GetMapping("/verify")
    public String verifyAccount(@Param("code") String code, Model model) {
        boolean verified = userDetailService.verify(code);

        String pageTitle = verified ? "Verification Succeed!" : "Verification Failed";
        model.addAttribute("title", pageTitle);

        // If verification succeeds, you might want to return a "success" view
        if (verified) {
            model.addAttribute("message", "Your account has been successfully verified.");
        } else {
            model.addAttribute("message", "Invalid verification code or account already verified.");
        }

        // Assuming the layout will handle what is shown based on content
        model.addAttribute("content", "verifyUser");
        model.addAttribute("css", "/stylesheets/faqs.css");

        return "layout"; // Make sure "layout" is a valid view
    }


}
