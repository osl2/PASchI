package edu.kit.informatik.repositories;

import org.springframework.stereotype.Repository;
import edu.kit.informatik.model.userdata.rooms.Chair;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Chair Tabellen}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface ChairRepository extends RoomObjectRepository {
}
