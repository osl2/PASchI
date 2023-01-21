package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.mapper.courses.SessionMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.repositories.SessionRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service für {@link Session Sitzungen}
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class SessionService extends BaseService<Session, SessionDto> {

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
    public SessionDto add(SessionDto sessionDto) {
        return null;
    }

    @Override
    public SessionDto update(SessionDto sessionDto) {
        return null;
    }

    @Override
    public SessionDto getById(String id) {
        return null;
    }

    @Override
    public List<SessionDto> getAll() {
        return null;
    }

    @Override
    public String delete(String id) {
        return null;
    }
}
