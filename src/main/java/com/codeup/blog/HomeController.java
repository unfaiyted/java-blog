package com.codeup.blog;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.concurrent.ThreadLocalRandom;


@Controller
public class HomeController {

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public String index() {
        return "home";
    }


    @RequestMapping(path = "/roll-dice", method = RequestMethod.GET)
    public String rollMain() {
        return "roll-dice";
    }

    @RequestMapping(path = "/roll-dice/{number}", method = RequestMethod.GET)
    public String roll(@PathVariable String number, Model model) {

        int randomNum = ThreadLocalRandom.current().nextInt(1, 7);

        model.addAttribute("page_submitted",true);
        model.addAttribute("roll_actual", randomNum);
        model.addAttribute("roll_guess",number);
        return "roll-dice";
    }
}