package edu.kit.informatik.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.kit.informatik.model.userdata.rooms.Table;

import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Table Tischen}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface TableRepository extends JpaRepository<Table, String> {

    Optional<Table> findTableById(String id);
}
