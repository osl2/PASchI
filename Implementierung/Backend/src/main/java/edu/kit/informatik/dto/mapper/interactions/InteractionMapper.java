package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import edu.kit.informatik.repositories.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class InteractionMapper implements IModelDtoMapper<Interaction, InteractionDto> {

    private final InteractionRepository interactionRepository;

    @Autowired
    public InteractionMapper(InteractionRepository interactionRepository) {
        this.interactionRepository = interactionRepository;
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
        // repository fehlt noch
        return null;
    }

    @Override
    public List<Interaction> dtoToModel(List<InteractionDto> interactionDtos) {
        List<Interaction> interactions = new LinkedList<>();
        interactionDtos.forEach(interactionDto -> interactions.add(dtoToModel(interactionDto)));

        return interactions;
    }
}
