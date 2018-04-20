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
            return index(model);
        }
    }

    @RequestMapping(path = "/posts/{id}/edit", method = RequestMethod.GET)
    public String edit(@PathVariable Long id, Model model) {
        Post post = postService.findOne(id);

        if (post != null) {
            model.addAttribute("action", "");
            model.addAttribute("post", post);
            return "posts/edit";
        } else {
            return index(model);
        }
    }

    @PostMapping("/posts/{id}/edit")
    public String editPost(@PathVariable Long id, @ModelAttribute Post post,  Model model) {
        // Post post = postService.findOne(id);
        if (post != null) {

            postService.edit(post);
            // model.addAttribute("edit", true);
            model.addAttribute("action", "/posts/"+ id +"/edit");
            model.addAttribute("post", post);
            return "posts/edit";
        } else {
            return index(model);
        }
    }

    @RequestMapping(path = "/posts/create", method = RequestMethod.GET)
    public String createGet(Model model) {
        model.addAttribute("action", "/posts/create");
        model.addAttribute("post", new Post());
        return "posts/create";
    }

    @PostMapping("/posts/create")
    public String createPost(@ModelAttribute Post post, Model model) {

        Long nextId = postService.getNextId();
        post.setId(nextId);
        postService.save(post);

        return view(nextId, model);
    }




}


