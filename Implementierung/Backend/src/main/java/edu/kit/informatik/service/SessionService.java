package edu.kit.informatik.service;

import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.repositories.SessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service für {@link Session Sitzungen}
 *
 * @author ugqbo
 * @version 1.0
 */

@Service
public class SessionService extends BaseService<Session, SessionDto> {

    private final SessionRepository sessionRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param sessionRepository {@link SessionRepository}
     */
    public SessionService(SessionRepository sessionRepository) {
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
    public SessionDto getById(long id) {
        return null;
    }

    @Override
    public List<SessionDto> getAll() {
        return null;
    }

    @Override
    public long delete(long id) {
        return 0;
    }
}
