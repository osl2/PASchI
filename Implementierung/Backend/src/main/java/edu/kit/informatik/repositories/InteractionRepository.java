package edu.kit.informatik.repositories;

import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Interaction Interactionen}.
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface InteractionRepository extends JpaRepository<Interaction, String> {

    /**
     * Rückgabe eines Optionals mit {@link Interaction}
     * @param id Id
     * @return {@link Optional} von {@link Interaction}
     */
    Optional<Interaction> findInteractionById(String id);

    Optional<List<Interaction>> findInteractionBySession(Session session);
}
