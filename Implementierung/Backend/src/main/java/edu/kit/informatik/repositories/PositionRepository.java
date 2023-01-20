package edu.kit.informatik.repositories;

import edu.kit.informatik.model.userdata.rooms.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Position Positionen}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface PositionRepository extends JpaRepository<Position, String> {

    /**
     * Rückgabe eines Optionals von {@link Position}
     * @param id Id
     * @return {@link Optional} von {@link Position}
     */
    Optional<Position> findPositionById(String id);

}
