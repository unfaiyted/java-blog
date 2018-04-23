package com.codeup.blog.controllers;

import com.codeup.blog.repositories.Users;
import com.codeup.blog.services.UserDetailsLoader;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.codeup.blog.models.User;


@Controller
public class AuthenticationController {

    @GetMapping("/login")
    public String showLoginForm(Model model) {
        User user = new User();

        Authentication token = SecurityContextHolder.getContext().getAuthentication();

        // not logged in
        model.addAttribute("user",user);
        if (token instanceof AnonymousAuthenticationToken) return "/users/login";

        // homepage
        return String.format("redirect:%s", "/");

    }



}
