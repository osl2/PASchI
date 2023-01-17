package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.interactions.StudentDto;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.ParticipantRepository;

import java.util.LinkedList;
import java.util.List;

public class ParticipantMapper implements IModelDtoMapper<Participant, ParticipantDto> {

    private final ParticipantRepository participantRepository;

    public ParticipantMapper(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    @Override
    public ParticipantDto modelToDto(Participant participant) {
        List<Long> courseIds = new LinkedList<>();
        List<Long> interactionIds = new LinkedList<>();

        participant.getCourses().forEach(course -> courseIds.add(course.getId()));
        participant.getInteractions().forEach(interaction -> interactionIds.add(interaction.getId()));

        return new StudentDto(
                participant.getId(),
                participant.getUser().getId(),
                participant.getFirstName(),
                participant.getLastName(),
                courseIds,
                interactionIds);
    }

    @Override
    public List<ParticipantDto> modelToDto(List<Participant> participants) {
        List<ParticipantDto> participantDtos = new LinkedList<>();
        participants.forEach(participant -> participantDtos.add(modelToDto(participant)));

        return participantDtos;
    }

    @Override
    public Participant dtoToModel(ParticipantDto participantDto) {
        // repository fehlt noch
        return null;
    }

    @Override
    public List<Participant> dtoToModel(List<ParticipantDto> participantDtos) {
        List<Participant> participants = new LinkedList<>();
        participantDtos.forEach(participantDto -> participants.add(dtoToModel(participantDto)));

        return participants;
    }
}
