package edu.kit.informatik.repositories;

import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.kit.informatik.model.User;

import java.util.List;
import java.util.Optional;

/**
 * Schnittstelle zur Datanbanktabelle mit {@link SeatArrangement Sitzordnungen}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface SeatArrangementRepository extends JpaRepository<SeatArrangement, String> {

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
    List<SeatArrangement> findSeatArrangementsByCourse(Course course);

    /**
     * Rückgabe von Optionals mit {@link SeatArrangement}
     * @param userId Id eines {@link User}
     * @return {@link Optional} von {@link SeatArrangement}
     */
    List<SeatArrangement> findSeatArrangementsByUserId(String userId);

}
