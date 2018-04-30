package com.codeup.blog.models;

import com.codeup.blog.models.User;
import com.fasterxml.jackson.annotation.*;

import javax.persistence.*;
import javax.print.Doc;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

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
    @Column(nullable = false,  columnDefinition="TEXT")
    private String body;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JsonBackReference(value = "owner-of")
    private User owner;

    @OneToMany(mappedBy = "post")
    @JsonBackReference(value = "post-documents")
    private List<Document> documents;

    // Blank Object
    public Post() {
    }

    public Post(User owner, String title, String body) {
        this.owner = owner;
        this.title = title;
        this.body = body;
        this.createdAt = LocalDateTime.now();
    }

    public Post(User owner, String title, String body, List<Document> documents) {
        this.owner = owner;
        this.title = title;
        this.body = body;
        this.documents = documents;
        this.createdAt = LocalDateTime.now();
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    @JsonProperty
    public List<Document> getDocuments() { return documents; }

    public void setDocuments(List<Document> documents) {

        for(Document document : documents) {
            document.setPost(this);
        }
        this.documents = documents;
    }

    public void addDocument(Document document) {
        this.documents.add(document);
    }
}
