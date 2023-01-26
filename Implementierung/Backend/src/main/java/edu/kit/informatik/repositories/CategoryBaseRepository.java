package edu.kit.informatik.repositories;

import edu.kit.informatik.model.userdata.interactions.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryBaseRepository<CategoryType extends Category, String>
        extends JpaRepository<CategoryType, String> {

    Optional<CategoryType> findCategoryById(String id);
/*
    Optional<CategoryType> findCategoryByInteraction();

 */
}
