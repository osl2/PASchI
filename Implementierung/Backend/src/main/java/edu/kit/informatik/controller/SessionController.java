package edu.kit.informatik.controller;

import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.service.SessionService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
public class SessionController extends BaseController<Session, SessionDto, SessionDto> {

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param sessionService {@link SessionService}
     */
    public SessionController(SessionService sessionService) {
        super(sessionService);
    }

    @Override
    @PostMapping
    public SessionDto add(@RequestBody SessionDto sessionDto) {
        return super.add(sessionDto);
    }

    @Override
    @PutMapping
    public SessionDto update(@RequestBody SessionDto sessionDto) {
        return super.update(sessionDto);
    }

    @Override
    @GetMapping(path = "/{id}")
    public SessionDto getById(@PathVariable("id") String id) {
        return super.getById(id);
    }

    @Override
    @GetMapping
    public List<SessionDto> getAll() {
        return super.getAll();
    }

    @Override
    @DeleteMapping
    public String delete(@RequestParam String id) {
        return super.delete(id);
    }
}
