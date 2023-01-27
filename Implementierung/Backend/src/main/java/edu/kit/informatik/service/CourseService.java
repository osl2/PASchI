package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.courses.CourseMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.repositories.CourseRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Service für {@link Course Kurse}
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class CourseService extends BaseService<Course, CourseDto, CourseDto> {

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
        Course newCourse = this.courseRepository.save(this.mapper.dtoToModel(courseDto));
        return this.mapper.modelToDto(newCourse);
    }

    @Transactional
    @Override
    public CourseDto update(CourseDto courseDto) {
        Optional<Course> repositoryCourseOptional = this.courseRepository.findById(courseDto.getId());

        if (repositoryCourseOptional.isEmpty()) {
            return null;
        }

        Course repositoryCourse = repositoryCourseOptional.get();
        Course newCourse = this.mapper.dtoToModel(courseDto);

        if (!newCourse.getName().equals(repositoryCourse.getName())) {
            repositoryCourse.setName(newCourse.getName());
        } else if (!newCourse.getSubject().equals(repositoryCourse.getSubject())) {
            repositoryCourse.setSubject(newCourse.getSubject());
        } else if (!newCourse.getParticipants().equals(repositoryCourse.getParticipants())) {
            repositoryCourse.setParticipants(newCourse.getParticipants());
        } else if (!newCourse.getSessions().equals(repositoryCourse.getSessions())) {
            repositoryCourse.setSessions(newCourse.getSessions());
        } else if (!newCourse.getSeatArrangements().equals(repositoryCourse.getSeatArrangements())) {
            repositoryCourse.setSeatArrangements(newCourse.getSeatArrangements());
        }

        return courseDto;
    }

    @Override
    public CourseDto getById(String id) {
        Optional<Course> courseOptional = this.courseRepository.findCourseById(id);

        return courseOptional.map(this.mapper::modelToDto).orElse(null);
    }

    @Override
    public List<CourseDto> getAll() {
        return this.mapper.modelToDto(this.courseRepository.findAll());
    }

    @Override
    public String delete(String id) {
        this.courseRepository.deleteById(id);
        return id;
    }
}
