package edu.kit.informatik.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.kit.informatik.model.userdata.rooms.Chair;

import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Chair Stühlen}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface ChairRepository extends JpaRepository<Chair, String> {
    /**
     * Rückgabe eines {@link Optional} von {@link Chair}
     * @param id Id eines {@link Chair}
     * @return {@link Optional} von {@link Chair}
     */
    Optional<Chair> findChairById(String id);
}
