package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantTypeDto;
import edu.kit.informatik.model.userdata.interactions.ParticipantType;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class ParticipantTypeMapper implements IModelDtoMapper<ParticipantType, ParticipantTypeDto> {
    
    @Override
    public ParticipantTypeDto modelToDto(ParticipantType ParticipantType) {
        return ParticipantTypeDto.valueOf(ParticipantType.toString());
    }

    @Override
    public List<ParticipantTypeDto> modelToDto(List<ParticipantType> qualities) {
        List<ParticipantTypeDto> ParticipantTypeDtos = new ArrayList<>();
        qualities.forEach(ParticipantType -> ParticipantTypeDtos.add(modelToDto(ParticipantType)));

        return ParticipantTypeDtos;
    }

    @Override
    public ParticipantType dtoToModel(ParticipantTypeDto ParticipantTypeDto) {
        return ParticipantType.valueOf(ParticipantTypeDto.toString());
    }

    @Override
    public List<ParticipantType> dtoToModel(List<ParticipantTypeDto> ParticipantTypeDtos) {
        List<ParticipantType> qualities = new ArrayList<>();
        ParticipantTypeDtos.forEach(ParticipantTypeDto -> qualities.add(dtoToModel(ParticipantTypeDto)));

        return qualities;
    }
}
