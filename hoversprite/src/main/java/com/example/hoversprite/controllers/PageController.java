package com.example.hoversprite.controllers;

import com.example.hoversprite.user.UserDetailService;
import com.example.hoversprite.user.User;
import com.example.hoversprite.Role.RoleRepository;
import com.example.hoversprite.user.UserRepository;

import com.example.hoversprite.service.PasswordValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

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
        //model.addAttribute("js", "/js/home.js");
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

//    @GetMapping("/register")
//    public String showSignUpForm(Model model, @RequestParam(value = "error", required = false) String error) {
//        model.addAttribute("title", "Register");
//        model.addAttribute("content", "register");
//        model.addAttribute("css", "/stylesheets/login.css");
//        model.addAttribute("js", "/js/login.js");
//
//        model.addAttribute("user", new User());
//         if (error != null) {
//             model.addAttribute("error", error);
//         }
//        return "layout";
//    }

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
    public String processRegister(User user, RedirectAttributes redirectAttributes) {
        // Validate the password
        passwordValidationService.validatePassword(user.getPassword());

        try {
            userDetailService.registerUser(user);
            return "redirect:/login";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/register";
        }
    }

    @GetMapping("/booking")
    public String booking(Model model) {
        model.addAttribute("title", "Booking");
        model.addAttribute("content", "booking");
        model.addAttribute("css", "/stylesheets/booking.css");
        model.addAttribute("js", "/js/booking.js");
        return "layout";
    }

    @GetMapping("/orders")
    public String orders(Model model) {
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

    @GetMapping("/account/user_profile")
    public String userProfile(Model model) {
        model.addAttribute("title", "User Profile");
        model.addAttribute("content", "userProfile");
        model.addAttribute("css", "/stylesheets/account.css");
        model.addAttribute("js", "/js/userProfile.js");
        return "layout";
    }

    @GetMapping("/account/notifications")
    public String notifications(Model model) {
        model.addAttribute("title", "Notifications");
        model.addAttribute("content", "notifications");
        model.addAttribute("css", "/stylesheets/account.css");
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


    @GetMapping("/error")
    public String handleError(Model model) {
        model.addAttribute("title", "404 Not Found");
        model.addAttribute("content", "404");
        return "layout";
    }
}
