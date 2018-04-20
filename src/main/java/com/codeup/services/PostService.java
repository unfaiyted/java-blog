package com.codeup.services;

import com.codeup.models.Post;
import com.codeup.repositories.Posts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostService {
    @Autowired
    private final Posts posts;

    @Autowired
    public PostService(Posts posts) {
        this.posts = posts;
    }

    public Posts findAll() {
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
