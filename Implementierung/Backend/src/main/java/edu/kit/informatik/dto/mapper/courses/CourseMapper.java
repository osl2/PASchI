package edu.kit.informatik.dto.mapper.courses;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.repositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class CourseMapper implements IModelDtoMapper<Course, CourseDto> {

    private final CourseRepository courseRepository;

    @Autowired
    public CourseMapper(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public CourseDto modelToDto(Course course) {
        List<String> sessionIds = new LinkedList<>();
        List<String> participantIds = new LinkedList<>();
        List<String> seatArrangementIds = new LinkedList<>();

        course.getSessions().forEach(session -> sessionIds.add(session.getId()));
        course.getParticipants().forEach(participant -> participantIds.add(participant.getId()));
        course.getSeatArrangements().forEach(seatArrangement -> seatArrangementIds.add(seatArrangement.getId()));

        return new CourseDto(
                course.getId(),
                course.getUser().getId(),
                course.getName(),
                course.getSubject(),
                sessionIds,
                participantIds,
                seatArrangementIds
        );
    }

    @Override
    public List<CourseDto> modelToDto(List<Course> courses) {
        List<CourseDto> courseDtos = new LinkedList<>();
        courses.forEach(course -> courseDtos.add(modelToDto(course)));

        return courseDtos;
    }

    @Override
    public Course dtoToModel(CourseDto courseDto) {
        // repository fehlt noch
        return null;
    }

    @Override
    public List<Course> dtoToModel(List<CourseDto> courseDtos) {
        List<Course> courses = new LinkedList<>();
        courseDtos.forEach(courseDto -> courses.add(dtoToModel(courseDto)));

        return courses;
    }
}
