package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, CourseDto> {

    Optional<Course> findCourseById(String id);

    Optional<List<Course>> findCoursesBy(User user);
}
