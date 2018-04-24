package com.codeup.blog.controllers;

import com.codeup.blog.models.Post;
import com.codeup.blog.models.User;
import com.codeup.blog.repositories.Posts;
import com.codeup.blog.repositories.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;


@Controller
public class PostController {
    private final Posts postDao;
    private final Users userDao;

    @Autowired
    public PostController(Posts postDao, Users userDao) {
        this.postDao = postDao;
        this.userDao = userDao;
    }

    @RequestMapping(path = "/posts", method = RequestMethod.GET)
    public String index(Model model) {

        model.addAttribute("posts", postDao.findAll());

        return "/posts/index";
    }

    @RequestMapping(path = "/posts/{id}", method = RequestMethod.GET)
    public String view(@PathVariable Long id, Model model) {

        if(postDao.findById(id).isPresent()) {
            model.addAttribute("post", postDao.findById(id).get());
            return "/posts/show";
        }

        return "redirect:/posts";
    }

    @RequestMapping(path = "/posts/{id}/edit", method = RequestMethod.GET)
    public String edit(@PathVariable Long id, Model model) {

        if(postDao.findById(id).isPresent()) {
            model.addAttribute("action", "");
            model.addAttribute("post", postDao.findById(id).get());
            return "/posts/edit";
        }
        return "redirect:/posts";

    }
    @PostMapping(path = "/posts/{id}/edit")
    public String editPost(@PathVariable Long id, @Valid Post post, Errors validation, Model model) {
            if(validation.hasErrors()) {
                model.addAttribute("errors", validation);
                model.addAttribute("post", post);
                return "/posts/" + id + "/edit";
            } else {
                post.setOwner(postDao.findById(id).get().getOwner());
                postDao.save(post);
                return "redirect:/posts";
            }
    }

    @RequestMapping(path = "/posts/create", method = RequestMethod.GET)
    public String createGet(Model model) {
        model.addAttribute("action", "/posts/create");
        model.addAttribute("post", new Post());
        return "/posts/create";
    }

    @PostMapping("/posts/create")
    public String createPost(@Valid Post post, Errors validation, Model model) {

        // Custom evaluation
        if (post.getTitle().endsWith("?")) {
            validation.rejectValue(
                    "title",
                    "post.title",
                    "You can't be unsure about your title!"
            );
        }


        if(validation.hasErrors()) {
            model.addAttribute("errors", validation);
            model.addAttribute("post", post);
            return "/posts/create";
        } else {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            post.setOwner(user);
            postDao.save(post);
            return "redirect:/posts";
        }
    }

    @RequestMapping("/posts/{id}/delete")
    public String delete(@PathVariable Long id) {
            postDao.delete(postDao.findById(id).get());
            return "redirect:/posts";

    }

    @GetMapping("/posts.json")
    public @ResponseBody List<Post> viewAllPostsInJSON() {

        List<Post> p = new ArrayList<>();
        postDao.findAll().forEach(p::add);

        return p;
    }

    @GetMapping("/posts/ajax")
    public String viewAllPostsWithAjax() {
        return "/posts/ajax";
    }

}


