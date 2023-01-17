package edu.kit.informatik.service;

import edu.kit.informatik.dto.interactions.ParticipantDto;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.ParticipantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service für {@link Participant Teilnehmer}
 *
 * @author ugqbo
 * @version 1.0
 */

@Service
public class ParticipantService implements BaseService<Participant, ParticipantDto> {

    private final ParticipantRepository participantRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param participantRepository {@link ParticipantRepository}
     */
    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    @Override
    public ParticipantDto add(ParticipantDto participantDto) {
        return null;
    }

    @Override
    public ParticipantDto update(ParticipantDto participantDto) {
        return null;
    }

    @Override
    public ParticipantDto getById(long id) {
        return null;
    }

    @Override
    public List<ParticipantDto> getAll() {
        return null;
    }

    @Override
    public long delete(long id) {
        return 0;
    }
}
