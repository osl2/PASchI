package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Schnittstelle zur Datanbanktabelle mit {@link SeatArrangement Sitzordnungen}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface SeatArrangementRepository extends JpaRepository<SeatArrangement, SeatArrangementDto> {

    /**
     * Rückgabe von Optionals mit {@link SeatArrangement}
     * @param id Id
     * @return {@link Optional} von {@link SeatArrangement}
     */
    Optional<SeatArrangement> findSeatArrangementById(String id);

    /**
     * Rückgabe von Optionals mit {@link SeatArrangement}
     * @param course {@link Course}
     * @return {@link Optional} von {@link SeatArrangement}
     */
    Optional<List<SeatArrangement>> findSeatArrangementsByCourse(Course course);

}
