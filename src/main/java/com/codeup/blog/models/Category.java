package com.codeup.blog.models;


import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name="category")
public class Category {
    @Id @GeneratedValue
    private Long id;

    @NotBlank(message = "Category must contain a name.")
    @Size(min = 5, message = "Post titles must be at least 5 characters long.")
    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition="TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt  = LocalDateTime.now();

    public Category() {
    }

    public Category(String name) {
        this.name = name;
    }

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
