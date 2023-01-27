package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.ParticipantRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Service für {@link Participant Teilnehmer}
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class ParticipantService extends BaseService<Participant, ParticipantDto, ParticipantDto> {

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
        Participant newParticipant = this.participantRepository.save(this.mapper.dtoToModel(participantDto));

        return this.mapper.modelToDto(newParticipant);
    }

    @Transactional
    @Override
    public ParticipantDto update(ParticipantDto participantDto) {
        Optional<Participant> repositoryParticipantOptional = this.participantRepository
                                                                    .findParticipantById(participantDto.getId());

        if (repositoryParticipantOptional.isEmpty()) {
            return null;
        }

        Participant repositoryParticipant = repositoryParticipantOptional.get();
        Participant newParticipant = this.mapper.dtoToModel(participantDto);

        if (!newParticipant.getFirstName().equals(repositoryParticipant.getFirstName())) {
            repositoryParticipant.setFirstName(newParticipant.getFirstName());
        } else if (!newParticipant.getLastName().equals(repositoryParticipant.getLastName())) {
            repositoryParticipant.setLastName(newParticipant.getLastName());
        } else if (!newParticipant.getCourses().equals(repositoryParticipant.getCourses())) {
            repositoryParticipant.setCourses(newParticipant.getCourses());
        } else if (!newParticipant.getInteractions().equals(repositoryParticipant.getInteractions())) {
            repositoryParticipant.setInteractions(newParticipant.getInteractions());
        }

        return participantDto;
    }

    @Override
    public ParticipantDto getById(String id) {
        Optional<Participant> participantOptional = this.participantRepository.findParticipantById(id);

        return participantOptional.map(this.mapper::modelToDto).orElse(null);
    }

    @Override
    public List<ParticipantDto> getAll() {
        return this.mapper.modelToDto(this.participantRepository.findAll());
    }

    @Override
    public String delete(String id) {
        this.participantRepository.deleteById(id);

        return id;
    }
}
