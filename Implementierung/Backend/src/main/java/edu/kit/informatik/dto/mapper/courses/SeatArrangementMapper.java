package edu.kit.informatik.dto.mapper.courses;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * {@link IModelDtoMapper} für {@link SeatArrangement} and {@link SeatArrangementDto}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Service
public class SeatArrangementMapper implements IModelDtoMapper<SeatArrangement, SeatArrangementDto> {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final RoomRepository roomRepository;
    private final ParticipantRepository participantRepository;
    private final ChairRepository chairRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param userRepository {@link UserRepository}
     * @param courseRepository {@link CourseRepository}
     * @param roomRepository {@link RoomRepository}
     * @param participantRepository {@link ParticipantRepository}
     * @param chairRepository {@link ChairRepository}
     */
    @Autowired
    public SeatArrangementMapper(UserRepository userRepository,
                                 CourseRepository courseRepository, RoomRepository roomRepository,
                                 ParticipantRepository participantRepository, ChairRepository chairRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.roomRepository = roomRepository;
        this.participantRepository = participantRepository;
        this.chairRepository = chairRepository;
    }

    @Override
    public SeatArrangementDto modelToDto(SeatArrangement seatArrangement) {
        Map<String, String> seatMap = new HashMap<>();
        seatArrangement.getSeatMap().forEach((chair, participant) -> seatMap.put(chair.getId(), participant.getId()));

        return new SeatArrangementDto(
                seatArrangement.getId(),
                seatArrangement.getUser().getId(),
                seatArrangement.getName(),
                seatMap,
                seatArrangement.getRoom().getId(),
                seatArrangement.getCourse().getId(),
                seatArrangement.getCreatedAt(),
                seatArrangement.getUpdatedAt()
        );
    }

    @Override
    public List<SeatArrangementDto> modelToDto(List<SeatArrangement> seatArrangements) {
        List<SeatArrangementDto> seatArrangementDtos = new ArrayList<>();
        seatArrangements.forEach(seatArrangement -> seatArrangementDtos.add(modelToDto(seatArrangement)));

        return seatArrangementDtos;
    }

    @Override
    public SeatArrangement dtoToModel(SeatArrangementDto seatArrangementDto) {
        User user = userRepository.findUserById(seatArrangementDto.getUserId()).orElse(null);
        Course course = courseRepository.findCourseById(seatArrangementDto.getCourseId()).orElse(null);
        Room room = roomRepository.findRoomById(seatArrangementDto.getRoomId()).orElse(null);

        Map<Chair, Participant> seatMap = new HashMap<>();

        seatArrangementDto.getSeatMap().forEach((chairId, participantId) -> {
            Participant participant = participantRepository.findParticipantById(participantId).orElse(null);
            Chair chair = chairRepository.findChairById(chairId).orElse(null);
            seatMap.put(chair, participant);
        });

        Timestamp updatedAt;

        if (seatArrangementDto.getUpdatedAt() == null) {
            updatedAt = seatArrangementDto.getCreatedAt();
        } else {
            updatedAt = seatArrangementDto.getUpdatedAt();
        }

        return new SeatArrangement(user, seatArrangementDto.getName(), room, course,
                                    seatMap, seatArrangementDto.getCreatedAt(), updatedAt);
    }

    @Override
    public List<SeatArrangement> dtoToModel(List<SeatArrangementDto> seatArrangementDtos) {
        List<SeatArrangement> seatArrangements = new ArrayList<>();
        seatArrangementDtos.forEach(seatArrangementDto -> seatArrangements.add(dtoToModel(seatArrangementDto)));

        return seatArrangements;
    }
}
