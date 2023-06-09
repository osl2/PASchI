package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.ParticipantRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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

    private static final String ID_ATTRIBUTE = "userId";

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
    public ParticipantDto add(ParticipantDto participantDto, Authentication authentication) {
        super.checkAuthorization(authentication, participantDto.getUserId());
        Participant newParticipant = this.participantRepository.save(this.mapper.dtoToModel(participantDto));

        return this.mapper.modelToDto(newParticipant);
    }

    @Transactional
    @Override
    public ParticipantDto update(ParticipantDto participantDto, Authentication authentication) {
        super.checkAuthorization(authentication, participantDto.getUserId());
        Optional<Participant> repositoryParticipantOptional = this.participantRepository
                                                                    .findParticipantById(participantDto.getId());

        Participant repositoryParticipant = repositoryParticipantOptional.orElseThrow(() ->
                                                new EntityNotFoundException(Participant.class, participantDto.getId()));
        Participant newParticipant = this.mapper.dtoToModel(participantDto);

        if (!newParticipant.getFirstName().equals(repositoryParticipant.getFirstName())) {
            repositoryParticipant.setFirstName(newParticipant.getFirstName());
            repositoryParticipant.setUpdatedAt(newParticipant.getUpdatedAt());
        }
        if (!newParticipant.getLastName().equals(repositoryParticipant.getLastName())) {
            repositoryParticipant.setLastName(newParticipant.getLastName());
            repositoryParticipant.setUpdatedAt(newParticipant.getUpdatedAt());
        }
        if (!newParticipant.getCourses().equals(repositoryParticipant.getCourses())) {
            repositoryParticipant.setCourses(newParticipant.getCourses());
            repositoryParticipant.setUpdatedAt(newParticipant.getUpdatedAt());
        }
        if (!newParticipant.getInteractions().equals(repositoryParticipant.getInteractions())) {
            repositoryParticipant.setInteractions(newParticipant.getInteractions());
            repositoryParticipant.setUpdatedAt(newParticipant.getUpdatedAt());
        }

        return mapper.modelToDto(repositoryParticipant);
    }

    @Override
    public ParticipantDto getById(String id, Authentication authentication) {
        Optional<Participant> participantOptional = this.participantRepository.findParticipantById(id);
        Participant participant = participantOptional.orElseThrow(() ->
                                        new EntityNotFoundException(Participant.class, id));
        super.checkAuthorization(authentication, participant.getUser().getId());

        return this.mapper.modelToDto(participant);
    }

    @Override
    public List<ParticipantDto> getAll(Authentication authentication) {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        return this.mapper.modelToDto(this.participantRepository.findParticipantsByUserId(
                                                                jAT.getTokenAttributes().get(ID_ATTRIBUTE).toString()));
    }

    @Transactional
    @Override
    public String delete(String id, Authentication authentication) {
        Optional<Participant> participantOptional = this.participantRepository.findParticipantById(id);
        Participant participant = participantOptional.orElseThrow(() ->
                                                                    new EntityNotFoundException(Participant.class, id));
        super.checkAuthorization(authentication, participant.getUser().getId());
        participant.setFirstName("Gelöschter");
        participant.setLastName("Teilnehmer");
        participant.setVisible(false);

        return id;
    }

    /**
     * Methode zum Löschen eines {@link Participant}
     * --> dient zum Löschen fpr andere Services
     * @param participant {@link Participant}
     */
    protected void delete(Participant participant) {
        participantRepository.deleteById(participant.getId());
    }
}
