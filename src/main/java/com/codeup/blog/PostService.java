package com.codeup.blog;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {
    private List<Post> posts;

    public PostService() {
        posts = new ArrayList<Post>;
        createPosts();
    }

    public List<Post> findAll() {
        return posts;
    }

    public Post findOne(Long id) {
        Post post = new Post("I found this","found one");

        return post;
    }

    public Post save(Post post) {
            posts.add(post);
            return post;
    }

    // Testing posts!
    private void createPosts() {

    }

}
