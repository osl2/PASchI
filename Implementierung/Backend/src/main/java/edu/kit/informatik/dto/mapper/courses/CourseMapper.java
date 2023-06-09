package edu.kit.informatik.dto.mapper.courses;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * {@link IModelDtoMapper} für {@link Course} and {@link CourseDto}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Service
public class CourseMapper implements IModelDtoMapper<Course, CourseDto> {

    private final UserRepository userRepository;
    private final ParticipantRepository participantRepository;
    private final SessionRepository sessionRepository;
    private final SeatArrangementRepository seatArrangementRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param userRepository {@link UserRepository}
     * @param participantRepository {@link ParticipantRepository}
     * @param sessionRepository {@link SessionRepository}
     * @param seatArrangementRepository {@link SeatArrangementRepository}
     */
    @Autowired
    public CourseMapper(UserRepository userRepository,
                        ParticipantRepository participantRepository, SessionRepository sessionRepository,
                        SeatArrangementRepository seatArrangementRepository) {
        this.userRepository = userRepository;
        this.participantRepository = participantRepository;
        this.sessionRepository = sessionRepository;
        this.seatArrangementRepository = seatArrangementRepository;
    }

    @Override
    public CourseDto modelToDto(Course course) {
        List<String> sessionIds = new ArrayList<>();
        List<String> participantIds = new ArrayList<>();
        List<String> seatArrangementIds = new ArrayList<>();

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
                seatArrangementIds,
                course.getCreatedAt(),
                course.getUpdatedAt()
        );
    }

    @Override
    public List<CourseDto> modelToDto(List<Course> courses) {
        List<CourseDto> courseDtos = new ArrayList<>();
        courses.forEach(course -> courseDtos.add(modelToDto(course)));

        return courseDtos;
    }

    @Override
    public Course dtoToModel(CourseDto courseDto) {

        User user = userRepository.findUserById(courseDto.getUserId()).orElse(null);

        List<Participant> participants = new ArrayList<>();
        List<Session> sessions = new ArrayList<>();
        List<SeatArrangement> seatArrangements = new ArrayList<>();

        if (courseDto.getParticipantIds() != null) {
            courseDto.getParticipantIds().forEach(id ->
                    participantRepository.findParticipantById(id).ifPresent(participants::add));
        }
        if (courseDto.getSessionIds() != null) {
            courseDto.getSessionIds().forEach(id ->
                    sessionRepository.findSessionById(id).ifPresent(sessions::add));
        }
        if (courseDto.getSeatArrangementIds() != null) {
            courseDto.getSeatArrangementIds().forEach(id ->
                    seatArrangementRepository.findSeatArrangementById(id).ifPresent(seatArrangements::add));
        }

        Timestamp updatedAt;

        if (courseDto.getUpdatedAt() == null) {
            updatedAt = courseDto.getCreatedAt();
        } else {
            updatedAt = courseDto.getUpdatedAt();
        }

        Course course = new Course(user, courseDto.getName(), courseDto.getSubject(),
                                        courseDto.getCreatedAt(), updatedAt);

        course.setParticipants(participants);
        course.setSessions(sessions);
        course.setSeatArrangements(seatArrangements);

        return course;
    }

    @Override
    public List<Course> dtoToModel(List<CourseDto> courseDtos) {
        List<Course> courses = new ArrayList<>();
        courseDtos.forEach(courseDto -> courses.add(dtoToModel(courseDto)));

        return courses;
    }
}
