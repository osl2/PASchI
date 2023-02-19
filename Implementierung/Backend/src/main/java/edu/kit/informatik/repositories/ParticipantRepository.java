package edu.kit.informatik.repositories;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit  {@link Participant Teilnehmern}.
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface ParticipantRepository extends JpaRepository<Participant, String> {

    /**
     * Methode zur Rückgabe eines Optionals von {@link Participant}
     * @param id Id
     * @return {@link Optional} von {@link Participant}
     */
    Optional<Participant> findParticipantById(String id);

    /**
     * Methode zur Rückgabe eins Optionals von {@link  Participant}
     * @param userId Id eines {@link User}
     * @return {@link Optional} von {@link Participant}
     */
    List<Participant> findParticipantsByUserId(String userId);
}
