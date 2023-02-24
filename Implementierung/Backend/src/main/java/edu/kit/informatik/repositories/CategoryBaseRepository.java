package edu.kit.informatik.repositories;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Category} und {@link RatedCategory}
 * @param <CategoryType> Typ extends {@link Category}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface CategoryBaseRepository<CategoryType extends Category>
        extends JpaRepository<CategoryType, java.lang.String> {

    /**
     * Rückgabe eines {@link Optional} mit {@link CategoryType}
     * @param id Id eines {@link CategoryType}
     * @return {@link Optional} von {@link CategoryType}
     */
    Optional<CategoryType> findCategoryById(java.lang.String id);

    /**
     * Rückgabe eines {@link Optional} mit {@link CategoryType}
     * @param userId Id eines {@link User}
     * @return {@link Optional} von {@link CategoryType}
     */
    List<CategoryType> findCategoryByUserId(java.lang.String userId);
/*
    Optional<CategoryType> findCategoryByInteraction();

 */
}
