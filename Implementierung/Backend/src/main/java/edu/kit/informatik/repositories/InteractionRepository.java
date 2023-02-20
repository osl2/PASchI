package edu.kit.informatik.repositories;

import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Interaction Interaktionen}.
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface InteractionRepository extends JpaRepository<Interaction, String> {

    /**
     * Rückgabe eines {@link Optional} mit {@link Interaction}
     * @param id Id einer {@link Interaction}
     * @return {@link Optional} von {@link Interaction}
     */
    Optional<Interaction> findInteractionById(String id);

    /**
     * Rückgabe eines {@link Optional} mit {@link Interaction}
     * @param session {@link Session}
     * @return {@link Optional} von {@link Interaction}
     */
    Optional<List<Interaction>> findInteractionBySession(Session session);
}
