package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.ParticipantRepository;
import jakarta.transaction.Transactional;
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
        }
        if (!newParticipant.getLastName().equals(repositoryParticipant.getLastName())) {
            repositoryParticipant.setLastName(newParticipant.getLastName());
        }
        if (!newParticipant.getCourses().equals(repositoryParticipant.getCourses())) {
            repositoryParticipant.setCourses(newParticipant.getCourses());
        }
        if (!newParticipant.getInteractions().equals(repositoryParticipant.getInteractions())) {
            repositoryParticipant.setInteractions(newParticipant.getInteractions());
        }

        return participantDto;
    }

    @Override
    public ParticipantDto getById(String id, Authentication authentication) {
        Optional<Participant> participantOptional = this.participantRepository.findParticipantById(id);

        return participantOptional.map(this.mapper::modelToDto).orElseThrow(() ->
                                                                    new EntityNotFoundException(Participant.class, id));
    }

    @Override
    public List<ParticipantDto> getAll(Authentication authentication) {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        return this.mapper.modelToDto(this.participantRepository.findParticipantsByUserId(
                                                                jAT.getTokenAttributes().get(ID_ATTRIBUTE).toString()));
    }

    @Override
    public String delete(String id, Authentication authentication) {
        Optional<Participant> participantOptional = this.participantRepository.findParticipantById(id);
        Participant participant = participantOptional.orElseThrow(() ->
                                                                    new EntityNotFoundException(Participant.class, id));
        super.checkAuthorization(authentication, participant.getUser().getId());
        this.participantRepository.deleteById(id);

        return id;
    }
}
