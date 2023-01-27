package edu.kit.informatik.controller;

import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.service.ParticipantService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller für {@link Participant Teilnehmer}.
 *
 * @author ugqbo
 * @version 1.0
 */
@RestController
@RequestMapping(path = "/api/participant")
public class ParticipantController extends BaseController<Participant, ParticipantDto, ParticipantDto> {

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param participantService {@link ParticipantService}
     */
    public ParticipantController(ParticipantService participantService) {
        super(participantService);
    }

    @Override
    @PostMapping
    public ParticipantDto add(ParticipantDto participantDto) {
        return super.add(participantDto);
    }

    @Override
    @PutMapping
    public ParticipantDto update(ParticipantDto participantDto) {
        return super.update(participantDto);
    }

    @Override
    @GetMapping(path = "/{id}")
    public ParticipantDto getById(@PathVariable("id") String id) {
        return super.getById(id);
    }

    @Override
    @GetMapping
    public List<ParticipantDto> getAll() {
        return super.getAll();
    }

    @Override
    @DeleteMapping
    public String delete(String id) {
        return super.delete(id);
    }
}
