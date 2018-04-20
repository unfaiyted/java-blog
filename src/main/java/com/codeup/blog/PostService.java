package com.codeup.blog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {
    @Autowired
    private final PostRepository posts;

    @Autowired
    public PostService(PostRepository posts) {
        this.posts = posts;
        createPosts();
    }

    public PostRepository findAll() {
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

    // Testing posts!
    private void createPosts() {
        posts.save(new Post(Long.parseLong("1"),"This is thde title","this is the body"));
        posts.save(new Post(Long.parseLong("2"),"This is the title","this is the body"));
        posts.save(new Post(Long.parseLong("3"),"This is the stitle","this is dthe body"));
        posts.save(new Post(Long.parseLong("4"),"This is thed title","this is thes body"));
        posts.save(new Post(Long.parseLong("5"),"This is the title","this is the body"));
        posts.save(new Post(Long.parseLong("6"),"This is dthe title","this is the boddy"));

    }

}
