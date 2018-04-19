package com.codeup.blog;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;


@Controller
public class PostController {

    @RequestMapping(path = "/posts", method = RequestMethod.GET)
    public String index(Model model) {

        List<Post> posts = new ArrayList<Post>();

        posts.add(new Post("My Best Post", "I am the best at posts"));
        posts.add(new Post("My Second Best Post", "I am the best at posts"));

        model.addAttribute("posts", posts);

        return "posts/index";
    }

    @RequestMapping(path = "/posts/{id}", method = RequestMethod.GET)
    public String view(@PathVariable int id, Model model) {

        Post post = new Post("My Best Post", "I am the best at posts");
        model.addAttribute(post);
        return "posts/show";
    }

    @RequestMapping(path = "/posts/create", method = RequestMethod.GET)
    public String createGet() {
        return "Form view for creating a post ";
    }

    @PostMapping("/posts/create")
    public String createPost() {
        return "Pages submitted to create a post ";
    }
}


