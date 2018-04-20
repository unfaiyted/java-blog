package com.codeup.repositories;

import com.codeup.models.Post;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Posts extends CrudRepository<Post, Long> {
    Post findByTitle(String title);

   //@Query("Select p from posts p where p.id=?1")
   //Optional<Post> findById(Long id);


}
