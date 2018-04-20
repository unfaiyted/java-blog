package com.codeup.blog;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {
    private List<Post> posts;

    public PostService() {
        posts = new ArrayList<Post>();
        createPosts();
    }

    public List<Post> findAll() {
        return posts;
    }

    public Post findOne(Long id) {
        for(Post post: posts) {
            if(post.getId().equals(id)) {
                return post;
            }
        }
        return null;
    }

    public Long getNextId() {
        Long id = Long.parseLong("0");
        for(Post post: posts) {
            if(post.getId()>id) {
                id = post.getId();
            }
        }
        return id+1;
    }

    public Post save(Post post) {
            posts.add(post);
            return post;
    }

    public Post edit(Post post) {
        for(Post p: posts) {
            if(p.getId().equals(post.getId())) {
                    p.setBody(post.getBody());
                    p.setTitle(post.getTitle());
            }
        }
        return null;
    }

    // Testing posts!
    private void createPosts() {
        posts.add(new Post(Long.parseLong("1"),"This is thde title","this is the body"));
        posts.add(new Post(Long.parseLong("2"),"This is the title","this is the body"));
        posts.add(new Post(Long.parseLong("3"),"This is the stitle","this is dthe body"));
        posts.add(new Post(Long.parseLong("4"),"This is thed title","this is thes body"));
        posts.add(new Post(Long.parseLong("5"),"This is the title","this is the body"));
        posts.add(new Post(Long.parseLong("6"),"This is dthe title","this is the boddy"));

    }

}
