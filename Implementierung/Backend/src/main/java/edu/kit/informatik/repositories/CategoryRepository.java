package edu.kit.informatik.repositories;

import org.springframework.stereotype.Repository;
import edu.kit.informatik.model.userdata.interactions.Category;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Category Kategorien}.
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface CategoryRepository extends CategoryBaseRepository<Category, String> {
}
