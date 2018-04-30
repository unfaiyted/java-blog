package com.codeup.blog.repositories;


import com.codeup.blog.models.Category;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Categories extends CrudRepository<Category, Long> {

    @Query("select c.name from  PostCategory pc, Category c where pc.post.getId()=?1 and pc.category.getId() = c.id")
    List<String> ofPost(Long id);

}
