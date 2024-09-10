package com.example.hoversprite.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

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
        model.addAttribute("title", "Orders");
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

    @GetMapping("/account")
    public String account(Model model) {
        model.addAttribute("title", "Account");
        model.addAttribute("content", "userProfile"); // Load userProfile by default
        model.addAttribute("css", "/stylesheets/userProfile.css");
        model.addAttribute("js", "/js/userProfile.js");
        return "layout";
    }

    @GetMapping("/account/user_profile")
    public String userProfile(Model model) {
        model.addAttribute("title", "User Profile");
        model.addAttribute("content", "userProfile");
        model.addAttribute("css", "/stylesheets/userProfile.css");
        model.addAttribute("js", "/js/userProfile.js");
        return "layout";
    }

    @GetMapping("/account/notifications")
    public String notifications(Model model) {
        model.addAttribute("title", "Notifications");
        model.addAttribute("content", "notifications");
        model.addAttribute("css", "/stylesheets/notifications.css");
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
}
