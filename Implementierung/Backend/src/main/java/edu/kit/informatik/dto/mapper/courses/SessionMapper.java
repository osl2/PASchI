package edu.kit.informatik.dto.mapper.courses;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.mapper.interactions.InteractionMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.SeatArrangementRepository;
import edu.kit.informatik.repositories.SessionRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SessionMapper implements IModelDtoMapper<Session, SessionDto, SessionDto> {

    private final SessionRepository sessionRepository;
    private final InteractionMapper interactionMapper;
    private final UserRepository userRepository;
    private final SeatArrangementRepository seatArrangementRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public SessionMapper(SessionRepository sessionRepository, InteractionMapper interactionMapper,
                         UserRepository userRepository, SeatArrangementRepository seatArrangementRepository,
                         CourseRepository courseRepository) {
        this.sessionRepository = sessionRepository;
        this.interactionMapper = interactionMapper;
        this.userRepository = userRepository;
        this.seatArrangementRepository = seatArrangementRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public SessionDto modelToDto(Session session) {
        List<InteractionDto> interactionDtos = new ArrayList<>();
        session.getInteractions().
                forEach(interaction -> interactionDtos.add(interactionMapper.modelToDto(interaction)));

        return new SessionDto(
                interactionDtos,
                session.getId(),
                session.getUser().getId(),
                session.getName(),
                session.getDate(),
                session.getCourse().getId(),
                session.getSeatArrangement().getId()
        );
    }

    @Override
    public List<SessionDto> modelToDto(List<Session> sessions) {
        List<SessionDto> sessionDtos = new ArrayList<>();
        sessions.forEach(session -> sessionDtos.add(modelToDto(session)));

        return sessionDtos;
    }

    @Override
    public Session dtoToModel(SessionDto sessionDto) {
        User user = userRepository.findUserById(sessionDto.getUserId()).orElse(null);
        Course course = courseRepository.findCourseById(sessionDto.getCourseId()).orElse(null);
        SeatArrangement seatArrangement = seatArrangementRepository.
                findSeatArrangementById(sessionDto.getSeatArrangementId()).orElse(null);

        List<Interaction> interactions = new ArrayList<>();
        if (sessionDto.getInteractions() != null) {
            sessionDto.getInteractions().forEach(interactionDto ->
                    interactions.add(interactionMapper.dtoToModel(interactionDto)));
        }

        Session session = sessionRepository.findSessionById(sessionDto.getId())
                                    .orElseGet(Session::new);

        session.setUser(user);
        session.setName(sessionDto.getName());
        session.setDate(sessionDto.getDate());
        session.setSeatArrangement(seatArrangement);
        session.setInteractions(interactions);
        session.setCourse(course);

        return session;
    }

    @Override
    public List<Session> dtoToModel(List<SessionDto> sessionDtos) {
        List<Session> sessions = new ArrayList<>();
        sessionDtos.forEach(sessionDto -> sessions.add(dtoToModel(sessionDto)));

        return sessions;
    }
}
