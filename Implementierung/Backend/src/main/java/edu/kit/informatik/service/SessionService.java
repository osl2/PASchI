package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.courses.SessionMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import edu.kit.informatik.repositories.InteractionRepository;
import edu.kit.informatik.repositories.SessionRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service für {@link Session Sitzungen}
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class SessionService extends BaseService<Session, SessionDto, SessionDto> {

    private static final String ID_ATTRIBUTE = "userId";

    private final SessionRepository sessionRepository;
    private final InteractionRepository interactionRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param sessionRepository     {@link SessionRepository}
     * @param sessionMapper         {@link SessionMapper}
     * @param interactionRepository {@link InteractionRepository}
     */
    public SessionService(SessionRepository sessionRepository, SessionMapper sessionMapper,
                          InteractionRepository interactionRepository) {
        super(sessionMapper);
        this.sessionRepository = sessionRepository;
        this.interactionRepository = interactionRepository;
    }

    @Override
    public SessionDto add(SessionDto sessionDto, Authentication authentication) {
        super.checkAuthorization(authentication, sessionDto.getUserId());
        Session session = this.mapper.dtoToModel(sessionDto);
        Session newSession = sessionRepository.save(saveInteractions(session));

        return this.mapper.modelToDto(newSession);
    }

    @Transactional
    @Override
    public SessionDto update(SessionDto sessionDto, Authentication authentication) {
        super.checkAuthorization(authentication, sessionDto.getUserId());
        Optional<Session> repositorySessionOptional = sessionRepository.findSessionById(sessionDto.getId());

        Session repositorySession = repositorySessionOptional.orElseThrow(() -> new EntityNotFoundException(
                                                                                    Session.class, sessionDto.getId()));
        Session newSession = this.mapper.dtoToModel(sessionDto);

        if (!newSession.getInteractions().equals(repositorySession.getInteractions())) {
            repositorySession.setInteractions(updateInteractions(repositorySession, newSession));
        }
        if (!newSession.getSeatArrangement().equals(repositorySession.getSeatArrangement())) {
            repositorySession.setSeatArrangement(repositorySession.getSeatArrangement());
        }
        if (!newSession.getName().equals(repositorySession.getName())) {
            repositorySession.setName(repositorySession.getName());
        }

        return mapper.modelToDto(repositorySession);
    }

    @Override
    public SessionDto getById(String id, Authentication authentication) {
        Optional<Session> sessionOptional = sessionRepository.findSessionById(id);

        return sessionOptional.map(this.mapper::modelToDto).orElseThrow(() -> new EntityNotFoundException(
                Session.class, id));
    }

    @Override
    public List<SessionDto> getAll(Authentication authentication) {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        return mapper.modelToDto(sessionRepository.findSessionsByUserId(
                                                                jAT.getTokenAttributes().get(ID_ATTRIBUTE).toString()));
    }

    @Override
    public String delete(String id, Authentication authentication) {
        Optional<Session> sessionOptional = sessionRepository.findById(id);
        if (sessionOptional.isEmpty()) {
            throw new EntityNotFoundException(Session.class, id);
        }

        this.sessionRepository.deleteById(id);

        return id;
    }

    private List<Interaction> updateInteractions(Session repositorySession , Session newSession) {
        List<Interaction> returnInteractions = new ArrayList<>();

        for (Interaction newInteraction: newSession.getInteractions()) {
            boolean found = false;
            for (Interaction repositoryInteraction: repositorySession.getInteractions()) {
                if (newInteraction.getId() != null && newInteraction.getId().equals(repositoryInteraction.getId())) {
                    returnInteractions.add(repositoryInteraction);
                    found = true;
                    break;
                }
            }
            if (!found) {
                returnInteractions.add(interactionRepository.save(newInteraction));
            }
        }

        return returnInteractions;
    }

    private Session saveInteractions(Session session) {
        Session newSession = new Session(session.getUser(), session.getName(), session.getDate(), session.getCourse(),
                session.getSeatArrangement(), session.getCreatedAt(), session.getUpdatedAt());
        for (int i = 0; i < session.getInteractions().size(); i++) {
            newSession.addInteraction(interactionRepository.save(session.getInteractions().get(i)));
        }

        return newSession;
    }
}
