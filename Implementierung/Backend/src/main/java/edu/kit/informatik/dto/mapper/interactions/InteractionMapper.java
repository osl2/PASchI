package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.model.userdata.interactions.Interaction;

import java.util.List;

public class InteractionMapper implements IModelDtoMapper<Interaction, InteractionDto> {

    @Override
    public InteractionDto modelToDto(Interaction interaction) {
        return null;
    }

    @Override
    public List<InteractionDto> modelToDto(List<Interaction> interactions) {
        return null;
    }

    @Override
    public Interaction dtoToModel(InteractionDto interactionDto) {
        return null;
    }

    @Override
    public List<Interaction> dtoToModel(List<InteractionDto> interactionDtos) {
        return null;
    }
}
