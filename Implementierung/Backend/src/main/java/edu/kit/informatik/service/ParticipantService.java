package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.ParticipantRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service für {@link Participant Teilnehmer}
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class ParticipantService extends BaseService<Participant, ParticipantDto> {

    private final ParticipantRepository participantRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param participantRepository {@link ParticipantRepository}
     * @param participantMapper {@link ParticipantMapper}
     */
    public ParticipantService(ParticipantRepository participantRepository,
                              ParticipantMapper participantMapper) {
        super(participantMapper);
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
