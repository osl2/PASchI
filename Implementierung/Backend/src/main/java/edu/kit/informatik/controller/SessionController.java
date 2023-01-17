package edu.kit.informatik.controller;

import edu.kit.informatik.dto.courses.SessionDto;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.service.SessionService;
import jakarta.websocket.server.PathParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller für {@link Session Sitzungen}.
 *
 * @author ugqbo
 * @version 1.0
 */
@RestController
@RequestMapping(path = "/api/session")
public class SessionController extends BaseController<Session, SessionDto> {

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param sessionService {@link SessionService}
     */
    public SessionController(SessionService sessionService) {
        this.service = sessionService;
    }

    @Override
    @PostMapping
    public SessionDto add(SessionDto sessionDto) {
        return super.add(sessionDto);
    }

    @Override
    @PutMapping
    public SessionDto update(SessionDto sessionDto) {
        return super.update(sessionDto);
    }

    @Override
    @GetMapping(path = "id")
    public SessionDto getById(@PathParam("id") long id) {
        return super.getById(id);
    }

    @Override
    @GetMapping
    public List<SessionDto> getAll() {
        return super.getAll();
    }

    @Override
    @DeleteMapping
    public long delete(long id) {
        return super.delete(id);
    }
}
