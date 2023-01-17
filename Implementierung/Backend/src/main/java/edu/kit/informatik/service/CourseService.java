package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.repositories.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service für {@link Course Kurse}
 *
 * @author ugqbo
 * @version 1.0
 */

@Service
public class CourseService extends BaseService<Course, CourseDto> {

    private final CourseRepository courseRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param courseRepository {@link CourseRepository}
     */
    public CourseService(CourseRepository courseRepository, IModelDtoMapper<Course, CourseDto> mapper) {
        super(mapper);
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
    public CourseDto getById(long id) {
        return null;
    }

    @Override
    public List<CourseDto> getAll() {
        return null;
    }

    @Override
    public long delete(long id) {
        return 0;
    }
}
