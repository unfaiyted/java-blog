package com.codeup.blog.models;

import com.codeup.blog.models.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

// Post object
@Entity
@Table(name="posts")
public class Post {
    @Id @GeneratedValue
    private Long id;

    @NotBlank(message = "Post must contain a title.")
    @Size(min = 5, message = "Post titles must be at least 5 characters long.")
    @Column(nullable = false, length = 255)
    private String title;
    @NotBlank(message = "Posts must have content.")
    @Size(min = 6, message = "The post must be longer.")
    @Column(nullable = false)
    private String body;

    @Column(length = 255)
    private String image;


    @ManyToOne
    @JsonManagedReference
    private User owner;

    // Blank Object
    public Post() {
    }

    public  Post(User owner, String title, String body) {
        this.owner = owner;
        this.title = title;
        this.body = body;
    }

    public  Post(User owner, String title, String body, String image) {
        this.owner = owner;
        this.title = title;
        this.body = body;
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getImage() { return image; }

    public void setImage(String image) { this.image = image; }
    
}
