package edu.kit.informatik.repositories;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Course Kursen}.
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, String> {

    /**
     * Rückgabe von Optional von {@link Course}
     * @param id Id
     * @return {@link Optional} von {@link Course}
     */
    Optional<Course> findCourseById(String id);

    /**
     * Rückgabe von Optional von {@link Course}
     * @param userId Id eines {@link User}
     * @return {@link Optional} von {@link Course}
     */
    List<Course> findCoursesByUserId(String userId);
}
