package com.codeup.blog.repositories;


import com.codeup.blog.models.Category;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCategories extends CrudRepository<Category, Long> {

    @Query("select c.name from  PostCategory pc, Category c where pc.post.id=?1 and pc.category.id = c.id")
    List<String> namesByPostId(Long id);

}
