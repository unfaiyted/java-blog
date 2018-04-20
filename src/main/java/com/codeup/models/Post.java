package com.codeup.models;

import com.codeup.models.User;

import javax.persistence.*;

// Post object
@Entity
@Table(name="posts")
public class Post {
    @Id @GeneratedValue
    private Long id;
    @Column(nullable = false, length = 255)
    private String title;
    @Column(nullable = false)
    private String body;

    @OneToOne
    private User owner;

    // Blank Object
    public Post() {

    }

    public  Post(User owner, String title, String body) {
        this.owner = owner;
        this.title = title;
        this.body = body;
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
}