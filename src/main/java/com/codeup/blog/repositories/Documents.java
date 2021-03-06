package com.codeup.blog.repositories;

        import com.codeup.blog.models.Document;
        import org.springframework.data.jpa.repository.Query;
        import org.springframework.data.repository.CrudRepository;
        import org.springframework.stereotype.Repository;

@Repository
public interface Documents extends CrudRepository<Document, Long> {

        @Query("Select max(d.id) FROM Document d")
        Long lastId();


}
