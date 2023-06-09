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
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * {@link IModelDtoMapper} für {@link Session} and {@link SessionDto}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Service
public class SessionMapper implements IModelDtoMapper<Session, SessionDto> {

    private final InteractionMapper interactionMapper;
    private final UserRepository userRepository;
    private final SeatArrangementRepository seatArrangementRepository;
    private final CourseRepository courseRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param interactionMapper {@link InteractionMapper}
     * @param userRepository {@link UserRepository}
     * @param seatArrangementRepository {@link SeatArrangementRepository}
     * @param courseRepository {@link CourseRepository}
     */
    @Autowired
    public SessionMapper(InteractionMapper interactionMapper,
                         UserRepository userRepository, SeatArrangementRepository seatArrangementRepository,
                         CourseRepository courseRepository) {
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

        String seatArrangementId = null;

        if (session.getSeatArrangement() != null) {
            seatArrangementId = session.getSeatArrangement().getId();
        }

        return new SessionDto(
                interactionDtos,
                session.getId(),
                session.getUser().getId(),
                session.getName(),
                session.getDate(),
                session.getCourse().getId(),
                seatArrangementId,
                session.getCreatedAt(),
                session.getUpdatedAt()
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

        Timestamp updatedAt;

        if (sessionDto.getUpdatedAt() == null) {
            updatedAt = sessionDto.getCreatedAt();
        } else {
            updatedAt = sessionDto.getUpdatedAt();
        }

        Session session = new Session(user, sessionDto.getName(), sessionDto.getDate(),
                                        course, seatArrangement, sessionDto.getCreatedAt(), updatedAt);

        session.setInteractions(interactions);

        return session;
    }

    @Override
    public List<Session> dtoToModel(List<SessionDto> sessionDtos) {
        List<Session> sessions = new ArrayList<>();
        sessionDtos.forEach(sessionDto -> sessions.add(dtoToModel(sessionDto)));

        return sessions;
    }
}
