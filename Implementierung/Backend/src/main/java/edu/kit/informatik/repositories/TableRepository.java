package edu.kit.informatik.repositories;

import org.springframework.stereotype.Repository;
import edu.kit.informatik.model.userdata.rooms.Table;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Table Tischen}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface TableRepository extends RoomObjectRepository {
}
