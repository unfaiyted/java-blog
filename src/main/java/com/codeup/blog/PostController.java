package com.codeup.blog;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;


@Controller
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @RequestMapping(path = "/posts", method = RequestMethod.GET)
    public String index(Model model) {

        model.addAttribute("posts", postService.findAll());

        return "posts/index";
    }

    @RequestMapping(path = "/posts/{id}", method = RequestMethod.GET)
    public String view(@PathVariable Long id, Model model) {



        Post post = postService.findOne(id);

        if (post != null) {
            model.addAttribute("post", post);
            return "posts/show";
        } else {
            return "posts/index";
        }
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


