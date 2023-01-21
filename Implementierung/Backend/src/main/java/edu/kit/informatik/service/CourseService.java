package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.mapper.courses.CourseMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.repositories.CourseRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service für {@link Course Kurse}
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class CourseService extends BaseService<Course, CourseDto> {

    private final CourseRepository courseRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param courseRepository {@link CourseRepository}
     * @param courseMapper {@link CourseMapper}
     */
    public CourseService(CourseRepository courseRepository, CourseMapper courseMapper) {
        super(courseMapper);
        this.courseRepository = courseRepository;
    }

    @Override
    public CourseDto add(CourseDto courseDto) {
        return null;
    }

    @Override
    public CourseDto update(CourseDto courseDto) {
        return null;
    }

    @Override
    public CourseDto getById(String id) {
        return null;
    }

    @Override
    public List<CourseDto> getAll() {
        return null;
    }

    @Override
    public String delete(String id) {
        return null;
    }
}
