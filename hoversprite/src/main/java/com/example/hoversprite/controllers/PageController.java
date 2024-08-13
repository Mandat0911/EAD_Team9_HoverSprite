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
        // model.addAttribute("js", "/js/home.js");
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

    @GetMapping("/account")
    public String account(Model model) {
        model.addAttribute("title", "Account");
        model.addAttribute("content", "account");
        model.addAttribute("css", "/stylesheets/account.css");
        // model.addAttribute("js", "/js/account.js");
        return "layout";
    }

    @GetMapping("/support")
    public String support(Model model) {
        model.addAttribute("title", "Support");
        model.addAttribute("content", "support");
        model.addAttribute("css", "/stylesheets/support.css");
        // model.addAttribute("js", "/js/support.js");
        return "layout";
    }


    // @GetMapping("/booking")
    // public String booking() {
    //     return "booking"; 
    // }

    // @GetMapping("/account")
    // public String order() {
    //     return "account"; 
    // }

    // @GetMapping("/support")
    // public String support() {
    //     return "support"; 
    // }
}
