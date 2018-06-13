package com.codeup.blog.controllers;

import com.codeup.blog.models.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import java.util.concurrent.ThreadLocalRandom;

@Controller
public class HomeController {

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public String index() {
        return "home";
    }



    @RequestMapping(path = "/resume", method = RequestMethod.GET)
    public String resume() {
        return "personal/resume";
    }





}