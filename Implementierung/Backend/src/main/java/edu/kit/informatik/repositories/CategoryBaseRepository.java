package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.model.userdata.interactions.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryBaseRepository extends JpaRepository<Category, CategoryDto> {

    Optional<Category> findCategoryById(String id);


    //Wirft Fehler
    Optional<Category> findCategoryByInteraction();
}
