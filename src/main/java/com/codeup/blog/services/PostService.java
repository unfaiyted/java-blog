package com.codeup.blog.services;

import com.codeup.blog.models.Category;
import com.codeup.blog.models.Post;
import com.codeup.blog.models.PostCategory;
import com.codeup.blog.repositories.Categories;
import com.codeup.blog.repositories.PostCategories;
import com.codeup.blog.repositories.Posts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {
    private final Posts posts;
    private final PostCategories categories;

    @Autowired
    public PostService(Posts posts, PostCategories categories) {
        this.posts = posts;
        this.categories = categories;
    }

    public Posts getPosts() {
        return posts;
    }
    
    public Post findOne(Long id) {
        for(Post post: posts.findAll()) {
            if(post.getId().equals(id)) {
                return post;
            }
        }
        return null;
    }

    public List<String> getCategoryNames(Long id) {
        return categories.namesByPostId(id);
    }

    public Long getNextId() {
        Long id = Long.parseLong("0");
        for(Post post: posts.findAll()) {
            if(post.getId()>id) {
                id = post.getId();
            }
        }
        return id+1;
    }

    public Post edit(Post post) {
        for(Post p: posts.findAll()) {
            if(p.getId().equals(post.getId())) {
                    p.setBody(post.getBody());
                    p.setTitle(post.getTitle());
            }
        }
        return null;
    }


}
