package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantTypeDto;
import edu.kit.informatik.model.userdata.interactions.ParticipantType;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * {@link IModelDtoMapper} für {@link ParticipantType} and {@link ParticipantType}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Service
public class ParticipantTypeMapper implements IModelDtoMapper<ParticipantType, ParticipantTypeDto> {
    
    @Override
    public ParticipantTypeDto modelToDto(ParticipantType participantType) {
        return ParticipantTypeDto.valueOf(participantType.toString());
    }

    @Override
    public List<ParticipantTypeDto> modelToDto(List<ParticipantType> qualities) {
        List<ParticipantTypeDto> participantTypeDtos = new ArrayList<>();
        qualities.forEach(ParticipantType -> participantTypeDtos.add(modelToDto(ParticipantType)));

        return participantTypeDtos;
    }

    @Override
    public ParticipantType dtoToModel(ParticipantTypeDto participantTypeDto) {
        return ParticipantType.valueOf(participantTypeDto.toString());
    }

    @Override
    public List<ParticipantType> dtoToModel(List<ParticipantTypeDto> participantTypeDtos) {
        List<ParticipantType> qualities = new ArrayList<>();
        participantTypeDtos.forEach(ParticipantTypeDto -> qualities.add(dtoToModel(ParticipantTypeDto)));

        return qualities;
    }
}
