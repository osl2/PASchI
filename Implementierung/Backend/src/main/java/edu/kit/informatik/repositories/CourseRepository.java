package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.courses.CourseDto;
import edu.kit.informatik.model.userdata.courses.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, CourseDto> {
}
