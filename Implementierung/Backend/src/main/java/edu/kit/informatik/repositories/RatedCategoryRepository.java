package edu.kit.informatik.repositories;

import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import org.springframework.stereotype.Repository;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link RatedCategoryRepository Qualitäts-Kategorien}.
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface RatedCategoryRepository extends CategoryBaseRepository<RatedCategory, String> {
}
