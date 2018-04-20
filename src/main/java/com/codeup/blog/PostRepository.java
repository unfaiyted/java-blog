package com.codeup.blog;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends CrudRepository<Post, Long> {
    Post findByTitle(String title);

   //@Query("Select p from posts p where p.id=?1")
   //Optional<Post> findById(Long id);


}
