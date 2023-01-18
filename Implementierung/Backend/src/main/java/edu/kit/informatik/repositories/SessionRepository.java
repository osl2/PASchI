package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, SessionDto> {


    Optional<Session> findSessionById(String id);

    Optional<List<Session>> findSessionsByCourse(Course course);
}
