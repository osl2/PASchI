package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.courses.CourseMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.ParticipantRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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

    private static final String ID_ATTRIBUTE = "userId";

    private final CourseRepository courseRepository;
    private final ParticipantRepository participantRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes
     *
     * @param courseRepository      {@link CourseRepository}
     * @param courseMapper          {@link CourseMapper}
     * @param participantRepository {@link ParticipantRepository}
     */
    public CourseService(CourseRepository courseRepository, CourseMapper courseMapper,
                                                                    ParticipantRepository participantRepository) {
        super(courseMapper);
        this.courseRepository = courseRepository;
        this.participantRepository = participantRepository;
    }

    @Override
    public CourseDto add(CourseDto courseDto, Authentication authentication) {
        super.checkAuthorization(authentication, courseDto.getUserId());
        Course newCourse = this.courseRepository.save(this.mapper.dtoToModel(courseDto));
        return this.mapper.modelToDto(newCourse);
    }

    @Transactional
    @Override
    public CourseDto update(CourseDto courseDto, Authentication authentication) {
        super.checkAuthorization(authentication, courseDto.getUserId());

        Optional<Course> repositoryCourseOptional = this.courseRepository.findCourseById(courseDto.getId());

        Course repositoryCourse = repositoryCourseOptional.orElseThrow(() ->
                                                        new EntityNotFoundException(Course.class, courseDto.getId()));
        Course newCourse = this.mapper.dtoToModel(courseDto);

        if (!newCourse.getName().equals(repositoryCourse.getName())) {
            repositoryCourse.setName(newCourse.getName());
        }
        if (!newCourse.getSubject().equals(repositoryCourse.getSubject())) {
            repositoryCourse.setSubject(newCourse.getSubject());
        }
        if (!newCourse.getParticipants().equals(repositoryCourse.getParticipants())) {
            repositoryCourse.setParticipants(newCourse.getParticipants());
        }
        if (!newCourse.getSessions().equals(repositoryCourse.getSessions())) {
            repositoryCourse.setSessions(newCourse.getSessions());
        }
        if (!newCourse.getSeatArrangements().equals(repositoryCourse.getSeatArrangements())) {
            repositoryCourse.setSeatArrangements(newCourse.getSeatArrangements());
        }

        return mapper.modelToDto(repositoryCourse);
    }

    @Override
    public CourseDto getById(String id, Authentication authentication) {
        Optional<Course> courseOptional = this.courseRepository.findCourseById(id);
        Course course = courseOptional.orElseThrow(() -> new EntityNotFoundException(Course.class, id));
        super.checkAuthorization(authentication, course.getUser().getId());

        return this.mapper.modelToDto(course);
    }

    @Override
    public List<CourseDto> getAll(Authentication authentication) {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        return this.mapper.modelToDto(this.courseRepository.findCoursesByUserId(
                jAT.getTokenAttributes().get(ID_ATTRIBUTE).toString()));
    }

    @Override
    public String delete(String id, Authentication authentication) {
        Optional<Course> courseOptional = this.courseRepository.findCourseById(id);
        Course course = courseOptional.orElseThrow(() -> new EntityNotFoundException(Course.class, id));
        super.checkAuthorization(authentication, course.getUser().getId());

        List<Participant> participants = participantRepository.findParticipantsByCourses(course);

        for (Participant participant: participants) {
            participant.getCourses().remove(course);
        }



        this.courseRepository.deleteById(id);
        return id;
    }
}
