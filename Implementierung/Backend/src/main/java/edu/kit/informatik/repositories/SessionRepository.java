package edu.kit.informatik.repositories;

import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Schnittstelle zur Datenbaktabelle mit {@link Session Sitzungen}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface SessionRepository extends JpaRepository<Session, String> {

    /**
     * Rückgabe von Optionals von {@link Session}
     * @param id Id
     * @return {@link Optional} von {@link Session}
     */
    Optional<Session> findSessionById(String id);

    /**
     * Rückgabe von Optionals von {@link Session}
     * @param course {@link Course}
     * @return {@link Optional} von {@link Session}
     */
    Optional<List<Session>> findSessionsByCourse(Course course);
}
