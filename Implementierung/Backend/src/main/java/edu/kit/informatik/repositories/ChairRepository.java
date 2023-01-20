package edu.kit.informatik.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.kit.informatik.model.userdata.rooms.Chair;

import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Chair Tabellen}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface ChairRepository extends JpaRepository<Chair, String> {

    Optional<Chair> findChairById(String id);
}
