package com.codeup.blog.repositories;

import com.codeup.blog.models.Post;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Posts extends CrudRepository<Post, Long> {
    Post findByTitle(String title);


    //@Query("Select p from posts p where p.id=?1")
   //Optional<Post> findById(Long id);


}
