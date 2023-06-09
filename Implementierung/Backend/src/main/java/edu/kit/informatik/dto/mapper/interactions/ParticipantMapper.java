package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantTypeDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.model.userdata.interactions.ParticipantType;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.InteractionRepository;
import edu.kit.informatik.repositories.UserRepository;
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
public class ParticipantMapper implements IModelDtoMapper<Participant, ParticipantDto> {
    private final ParticipantTypeMapper participantTypeMapper;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final InteractionRepository interactionRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param participantTypeMapper {@link ParticipantTypeMapper}
     * @param userRepository {@link UserRepository}
     * @param courseRepository {@link CourseRepository}
     * @param interactionRepository {@link InteractionRepository}
     */
    @Autowired
    public ParticipantMapper(ParticipantTypeMapper participantTypeMapper, UserRepository userRepository,
                             CourseRepository courseRepository, InteractionRepository interactionRepository) {
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
                interactionIds,
                participant.isVisible(),
                participant.getCreatedAt(),
                participant.getUpdatedAt()
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
        User user = userRepository.findUserById(participantDto.getUserId()).orElse(null);
        ParticipantType participantType = participantTypeMapper.dtoToModel(participantDto.getParticipantType());
        
        List<Course> courses = new ArrayList<>();
        List<Interaction> interactions = new ArrayList<>();


        if (participantDto.getCourseIds() != null) {
            participantDto.getCourseIds().forEach(courseId ->
                    courseRepository.findCourseById(courseId).ifPresent(courses::add));
        }
        if (participantDto.getInteractionIds() != null) {
            participantDto.getInteractionIds().forEach(interactionId ->
                    interactionRepository.findInteractionById(interactionId).ifPresent(interactions::add));
        }

        Timestamp updatedAt;

        if (participantDto.getUpdatedAt() == null) {
            updatedAt = participantDto.getCreatedAt();
        } else {
            updatedAt = participantDto.getUpdatedAt();
        }

        Participant participant = new Participant(user, participantDto.getFirstName(), participantDto.getLastName(),
                                participantType, participantDto.isVisible(), participantDto.getCreatedAt(), updatedAt);

        participant.setCourses(courses);
        participant.setInteractions(interactions);

        return participant;
    }

    @Override
    public List<Participant> dtoToModel(List<ParticipantDto> participantDtos) {
        List<Participant> participants = new ArrayList<>();
        participantDtos.forEach(participantDto -> participants.add(dtoToModel(participantDto)));

        return participants;
    }
}
