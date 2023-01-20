package edu.kit.informatik.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryBaseRepository<Category, String> extends JpaRepository<Category, String> {

    Optional<Category> findCategoryById(String id);


    //Wirft Fehler
    Optional<Category> findCategoryByInteraction();
}
