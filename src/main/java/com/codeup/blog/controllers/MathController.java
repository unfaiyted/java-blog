package com.codeup.blog.controllers;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class MathController {

    @RequestMapping(path = "/add/{first}/and/{second}", method = RequestMethod.GET)
    public String add(@PathVariable int first, @PathVariable int second) {
        return "Add:" + (first + second);
    }


    @RequestMapping(path = "/subtract/{first}/and/{second}", method = RequestMethod.GET)
    public String subtract(@PathVariable int first, @PathVariable int second) {
        return "Subtract:" + (first - second);
    }


    @RequestMapping(path = "/multiply/{first}/and/{second}", method = RequestMethod.GET)
    public String  multiply(@PathVariable int first, @PathVariable int second) {
        return "Multiply:" + (first * second);
    }


    @RequestMapping(path = "/divide/{first}/and/{second}", method = RequestMethod.GET)
    public String divide(@PathVariable int first, @PathVariable int second) {
        return "Subtract:" + (first / second);
    }
}


