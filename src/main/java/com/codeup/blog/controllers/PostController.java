package com.codeup.blog.controllers;

import com.codeup.blog.models.Document;
import com.codeup.blog.models.Post;
import com.codeup.blog.models.User;
import com.codeup.blog.repositories.Documents;
import com.codeup.blog.repositories.Posts;
import com.codeup.blog.repositories.Users;
import com.codeup.blog.services.DocumentUploadService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@Controller
public class PostController {
    private final Posts postDao;
    private final Users userDao;
    private final Documents docDao;

    @Autowired
    public PostController(Posts postDao, Users userDao, Documents docDao) {
        this.postDao = postDao;
        this.userDao = userDao;
        this.docDao = docDao;
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
        model.addAttribute("docs", "");
        return "/posts/create";
    }

    @PostMapping("/posts/create")
    public String createPost(@Valid Post post, Errors validation, @RequestParam("post-documents") String attach, Model model) throws IOException {

        List<Document> documents = new ArrayList<>();

        if(attach.length() > 1) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode docs = mapper.readTree(attach);

                for (JsonNode doc : docs) {
                    System.out.println("found doc");
                    Document document = new Document(doc.get("fileName").toString(),doc.get("fileName").toString(),doc.get("fileSize").longValue());
                    documents.add(document);
                }

        }

        System.out.println("total docs:" + documents.size());

        // Custom evaluation example
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
            model.addAttribute("docs", attach);
            return "/posts/create";
        } else {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            post.setOwner(user);
            postDao.save(post);
            post.setDocuments(documents);
            docDao.saveAll(post.getDocuments());
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


