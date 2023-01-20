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

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseMapper implements IModelDtoMapper<Course, CourseDto> {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ParticipantRepository participantRepository;
    private final SessionRepository sessionRepository;
    private final SeatArrangementRepository seatArrangementRepository;

    @Autowired
    public CourseMapper(CourseRepository courseRepository, UserRepository userRepository,
                        ParticipantRepository participantRepository, SessionRepository sessionRepository,
                        SeatArrangementRepository seatArrangementRepository) {
        this.courseRepository = courseRepository;
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
                seatArrangementIds
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
        Course course = courseRepository.findCourseById(courseDto.getId()).orElseGet(Course::new);
        User user = userRepository.findUserById(courseDto.getUserId()).orElse(null);

        List<Participant> participants = new ArrayList<>();
        List<Session> sessions = new ArrayList<>();
        List<SeatArrangement> seatArrangements = new ArrayList<>();

        courseDto.getParticipantIds().forEach(id ->
                participants.add(participantRepository.findParticipantById(id).orElse(null)));
        courseDto.getSessionIds().forEach(id ->
                sessions.add(sessionRepository.findSessionById(id).orElse(null)));
        courseDto.getSeatArrangementIds().forEach(id ->
                seatArrangements.add(seatArrangementRepository.findSeatArrangementById(id).orElse(null)));

        course.setUser(user);
        course.setName(courseDto.getName());
        course.setSubject(courseDto.getSubject());
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
