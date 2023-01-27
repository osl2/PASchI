package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantTypeDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.model.userdata.interactions.ParticipantType;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.InteractionRepository;
import edu.kit.informatik.repositories.ParticipantRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ParticipantMapper implements IModelDtoMapper<Participant, ParticipantDto, ParticipantDto> {

    private final ParticipantRepository participantRepository;
    private final ParticipantTypeMapper participantTypeMapper;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final InteractionRepository interactionRepository;

    @Autowired
    public ParticipantMapper(ParticipantRepository participantRepository, ParticipantTypeMapper participantTypeMapper,
                             UserRepository userRepository, CourseRepository courseRepository,
                             InteractionRepository interactionRepository) {
        this.participantRepository = participantRepository;
        this.participantTypeMapper = participantTypeMapper;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.interactionRepository = interactionRepository;
    }

    @Override
    public ParticipantDto modelToDto(Participant participant) {
        List<String> courseIds = new ArrayList<>();
        List<String> interactionIds = new ArrayList<>();
        ParticipantTypeDto participantTypeDto = participantTypeMapper.modelToDto(participant.getParticipantType());

        participant.getCourses().forEach(course -> courseIds.add(course.getId()));
        participant.getInteractions().forEach(interaction -> interactionIds.add(interaction.getId()));

        return new ParticipantDto(
                participant.getId(),
                participant.getUser().getId(),
                participant.getFirstName(),
                participant.getLastName(),
                participantTypeDto,
                courseIds,
                interactionIds
        );
    }

    @Override
    public List<ParticipantDto> modelToDto(List<Participant> participants) {
        List<ParticipantDto> participantDtos = new ArrayList<>();
        participants.forEach(participant -> participantDtos.add(modelToDto(participant)));

        return participantDtos;
    }

    @Override
    public Participant dtoToModel(ParticipantDto participantDto) {
        Participant participant = participantRepository.
                findParticipantById(participantDto.getId()).orElseGet(Participant::new);
        User user = userRepository.findUserById(participantDto.getUserId()).orElse(null);
        ParticipantType participantType = participantTypeMapper.dtoToModel(participantDto.getParticipantType());
        
        List<Course> courses = new ArrayList<>();
        List<Interaction> interactions = new ArrayList<>();

        participantDto.getCourseIds().forEach(courseId ->
                courses.add(courseRepository.findCourseById(courseId).orElse(null)));
        participantDto.getInteractionIds().forEach(interactionId ->
                interactions.add(interactionRepository.findInteractionById(interactionId).orElse(null)));

        participant.setUser(user);
        participant.setFirstName(participantDto.getFirstName());
        participant.setLastName(participantDto.getLastName());
        participant.setCourses(courses);
        participant.setInteractions(interactions);
        participant.setParticipantType(participantType);

        return participant;
    }

    @Override
    public List<Participant> dtoToModel(List<ParticipantDto> participantDtos) {
        List<Participant> participants = new ArrayList<>();
        participantDtos.forEach(participantDto -> participants.add(dtoToModel(participantDto)));

        return participants;
    }
}
