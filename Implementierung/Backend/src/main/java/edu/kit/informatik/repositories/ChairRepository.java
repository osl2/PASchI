package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.rooms.ChairDto;
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
public interface ChairRepository extends JpaRepository<Chair, ChairDto> {

    Optional<Chair> findChairById(String id);
}
