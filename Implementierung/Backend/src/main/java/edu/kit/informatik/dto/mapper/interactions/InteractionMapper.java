package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class InteractionMapper implements IModelDtoMapper<Interaction, InteractionDto> {

    private final InteractionRepository interactionRepository;
    private final UserRepository userRepository;
    private final ParticipantRepository participantRepository;
    private final SessionRepository sessionRepository;
    private final CategoryBaseRepository<Category, String> categoryBaseRepository;

    @Autowired
    public InteractionMapper(InteractionRepository interactionRepository, UserRepository userRepository,
                             ParticipantRepository participantRepository, SessionRepository sessionRepository,
                             CategoryBaseRepository<Category, String> categoryBaseRepository) {
        this.interactionRepository = interactionRepository;
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
                interaction.getCategory().getId()
        );
    }

    @Override
    public List<InteractionDto> modelToDto(List<Interaction> interactions) {
        List<InteractionDto> interactionDtos = new LinkedList<>();
        interactions.forEach(interaction -> interactionDtos.add(modelToDto(interaction)));

        return interactionDtos;
    }

    @Override
    public Interaction dtoToModel(InteractionDto interactionDto) {
        Interaction interaction = interactionRepository.
                findInteractionById(interactionDto.getId()).orElseGet(Interaction::new);
        User user = userRepository.findUserById(interactionDto.getUserId()).orElse(null);
        Session session = sessionRepository.findSessionById(interactionDto.getSessionId()).orElse(null);
        Participant fromParticipant = participantRepository.
                findParticipantById(interactionDto.getFromParticipantId()).orElse(null);
        Participant toParticipant = participantRepository.
                findParticipantById(interactionDto.getToParticipantId()).orElse(null);
        Category category = categoryBaseRepository.findCategoryById(interactionDto.getCategoryId()).orElse(null);

        interaction.setUser(user);
        interaction.setFrom(fromParticipant);
        interaction.setTo(toParticipant);
        interaction.setSession(session);
        interaction.setCategory(category);
        interaction.setTimeStamp(interactionDto.getTimeStamp());

        return interaction;
    }

    @Override
    public List<Interaction> dtoToModel(List<InteractionDto> interactionDtos) {
        List<Interaction> interactions = new LinkedList<>();
        interactionDtos.forEach(interactionDto -> interactions.add(dtoToModel(interactionDto)));

        return interactions;
    }
}