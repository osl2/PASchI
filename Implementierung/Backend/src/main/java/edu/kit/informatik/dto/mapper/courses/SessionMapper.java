package edu.kit.informatik.dto.mapper.courses;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.mapper.interactions.InteractionMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import edu.kit.informatik.repositories.InteractionRepository;
import edu.kit.informatik.repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class SessionMapper implements IModelDtoMapper<Session, SessionDto> {

    private final SessionRepository sessionRepository;
    private final InteractionRepository interactionRepository;

    @Autowired
    public SessionMapper(SessionRepository sessionRepository, InteractionRepository interactionRepository) {
        this.sessionRepository = sessionRepository;
        this.interactionRepository = interactionRepository;
    }

    @Override
    public SessionDto modelToDto(Session session) {
        IModelDtoMapper<Interaction, InteractionDto> interactionMapper = new InteractionMapper(interactionRepository);
        List<InteractionDto> interactionDtos = new LinkedList<>();
        session.getInteractions().forEach(interaction ->
                interactionDtos.add(interactionMapper.modelToDto(interaction)));

        return new SessionDto(
                session.getId(),
                session.getUser().getId(),
                session.getName(),
                session.getDate(),
                session.getCourse().getId(),
                session.getSeatArrangement().getId(),
                interactionDtos);
    }

    @Override
    public List<SessionDto> modelToDto(List<Session> sessions) {
        List<SessionDto> sessionDtos = new LinkedList<>();
        sessions.forEach(session -> sessionDtos.add(modelToDto(session)));

        return sessionDtos;
    }

    @Override
    public Session dtoToModel(SessionDto sessionDto) {
        // repository fehlt noch
        return null;
    }

    @Override
    public List<Session> dtoToModel(List<SessionDto> sessionDtos) {
        List<Session> sessions = new LinkedList<>();
        sessionDtos.forEach(sessionDto -> sessions.add(dtoToModel(sessionDto)));

        return sessions;
    }
}
