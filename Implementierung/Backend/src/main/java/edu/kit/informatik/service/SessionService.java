package edu.kit.informatik.service;


import edu.kit.informatik.dto.mapper.courses.SessionMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.repositories.SessionRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

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

    private final SessionRepository sessionRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param sessionRepository {@link SessionRepository}
     * @param sessionMapper {@link SessionMapper}
     */
    public SessionService(SessionRepository sessionRepository, SessionMapper sessionMapper) {
        super(sessionMapper);
        this.sessionRepository = sessionRepository;
    }

    @Override
    public SessionDto add(SessionDto sessionDto, Authentication authentication) {
        super.checkAuthorization(authentication, sessionDto.getUserId());
        Session session = this.mapper.dtoToModel(sessionDto);
        Session newSession = sessionRepository.save(session);

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
            repositorySession.setInteractions(repositorySession.getInteractions());
        } else if (!newSession.getSeatArrangement().equals(repositorySession.getSeatArrangement())) {
            repositorySession.setSeatArrangement(repositorySession.getSeatArrangement());
        } else if (!newSession.getName().equals(repositorySession.getName())) {
            repositorySession.setName(repositorySession.getName());
        }

        return sessionDto;
    }

    @Override
    public SessionDto getById(String id, Authentication authentication) {
        super.checkAuthorization(authentication, id);
        Optional<Session> sessionOptional = sessionRepository.findSessionById(id);

        return sessionOptional.map(this.mapper::modelToDto).orElseThrow(() -> new EntityNotFoundException(
                Session.class, id));
    }

    @Override
    public List<SessionDto> getAll(Authentication authentication) {
        return mapper.modelToDto(sessionRepository.findAll());
    }

    @Override
    public String delete(String id, Authentication authentication) {
        super.checkAuthorization(authentication, id);
        Optional<Session> sessionOptional = sessionRepository.findById(id);
        if (sessionOptional.isEmpty()) {
            throw new EntityNotFoundException(Session.class, id);
        }

        this.sessionRepository.deleteById(id);

        return id;
    }
}
