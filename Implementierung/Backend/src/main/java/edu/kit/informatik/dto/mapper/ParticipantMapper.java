package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.model.userdata.interactions.Participant;

import java.util.List;

public class ParticipantMapper implements IModelDtoMapper<Participant, ParticipantDto> {

    @Override
    public ParticipantDto modelToDto(Participant participant) {
        return null;
    }

    @Override
    public List<ParticipantDto> modelToDto(List<Participant> participants) {
        return null;
    }

    @Override
    public Participant dtoToModel(ParticipantDto participantDto) {
        return null;
    }

    @Override
    public List<Participant> dtoToModel(List<ParticipantDto> participantDtos) {
        return null;
    }
}
