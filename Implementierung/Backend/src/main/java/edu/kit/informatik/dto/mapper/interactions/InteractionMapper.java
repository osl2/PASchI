package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * {@link IModelDtoMapper} für {@link Session} and {@link SessionDto}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Service
public class InteractionMapper implements IModelDtoMapper<Interaction, InteractionDto> {
    private final UserRepository userRepository;
    private final ParticipantRepository participantRepository;
    private final SessionRepository sessionRepository;
    private final CategoryBaseRepository<Category> categoryBaseRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param userRepository {@link UserRepository}
     * @param participantRepository {@link ParticipantRepository}
     * @param sessionRepository {@link SessionRepository}
     * @param categoryBaseRepository {@link CategoryBaseRepository}
     */
    @Autowired
    public InteractionMapper(UserRepository userRepository,
                             ParticipantRepository participantRepository, SessionRepository sessionRepository,
                             CategoryBaseRepository<Category> categoryBaseRepository) {
        this.userRepository = userRepository;
        this.participantRepository = participantRepository;
        this.sessionRepository = sessionRepository;
        this.categoryBaseRepository = categoryBaseRepository;
    }

    @Override
    public InteractionDto modelToDto(Interaction interaction) {
        return new InteractionDto(
                interaction.getId(),
                interaction.getUser().getId(),
                interaction.getTimeStamp(),
                interaction.getSession().getId(),
                interaction.getTo().getId(),
                interaction.getFrom().getId(),
                interaction.getCategory().getId(),
                interaction.getCreatedAt(),
                interaction.getUpdatedAt()
        );
    }

    @Override
    public List<InteractionDto> modelToDto(List<Interaction> interactions) {
        List<InteractionDto> interactionDtos = new ArrayList<>();
        interactions.forEach(interaction -> interactionDtos.add(modelToDto(interaction)));

        return interactionDtos;
    }

    @Override
    public Interaction dtoToModel(InteractionDto interactionDto) {
        User user = userRepository.findUserById(interactionDto.getUserId()).orElse(null);
        Session session = sessionRepository.findSessionById(interactionDto.getSessionId()).orElse(null);
        Participant fromParticipant = participantRepository.
                findParticipantById(interactionDto.getFromParticipantId()).orElse(null);
        Participant toParticipant = participantRepository.
                findParticipantById(interactionDto.getToParticipantId()).orElse(null);
        Category category = categoryBaseRepository.findCategoryById(interactionDto.getCategoryId()).orElse(null);

        Timestamp updatedAt;

        if (interactionDto.getUpdatedAt() == null) {
            updatedAt = interactionDto.getCreatedAt();
        } else {
            updatedAt = interactionDto.getUpdatedAt();
        }

        return new Interaction(interactionDto.getId(), user, interactionDto.getTimeStamp(), session,
                                fromParticipant, toParticipant, category, interactionDto.getCreatedAt(), updatedAt);
    }

    @Override
    public List<Interaction> dtoToModel(List<InteractionDto> interactionDtos) {
        List<Interaction> interactions = new ArrayList<>();
        interactionDtos.forEach(interactionDto -> interactions.add(dtoToModel(interactionDto)));

        return interactions;
    }
}
