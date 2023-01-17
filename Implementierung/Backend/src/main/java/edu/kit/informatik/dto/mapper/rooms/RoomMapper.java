package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.dto.userdata.rooms.RoomObjectDto;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.model.userdata.rooms.RoomObject;
import edu.kit.informatik.repositories.PositionRepository;
import edu.kit.informatik.repositories.RoomObjectRepository;
import edu.kit.informatik.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class RoomMapper implements IModelDtoMapper<Room, RoomDto> {

    private final RoomRepository roomRepository;
    private final RoomObjectRepository roomObjectRepository;
    private final PositionRepository positionRepository;

    @Autowired
    public RoomMapper(RoomRepository roomRepository, RoomObjectRepository roomObjectRepository,
                      PositionRepository positionRepository) {
        this.roomRepository = roomRepository;
        this.roomObjectRepository = roomObjectRepository;
        this.positionRepository = positionRepository;
    }

    @Override
    public RoomDto modelToDto(Room room) {
        IModelDtoMapper<RoomObject, RoomObjectDto> roomObjectMapper = new RoomObjectMapper(roomObjectRepository,
                positionRepository);
        List<RoomObjectDto> roomObjectDtos = new LinkedList<>();
        room.getRoomObjects().forEach(roomObject -> roomObjectDtos.add(roomObjectMapper.modelToDto(roomObject)));

        return new RoomDto(
                room.getId(),
                room.getUser().getId(),
                room.getName(),
                roomObjectDtos
        );
    }

    @Override
    public List<RoomDto> modelToDto(List<Room> rooms) {
        List<RoomDto> roomDtos = new LinkedList<>();
        rooms.forEach(room -> roomDtos.add(modelToDto(room)));

        return roomDtos;
    }

    @Override
    public Room dtoToModel(RoomDto roomDto) {
        // repository fehlt noch
        return null;
    }

    @Override
    public List<Room> dtoToModel(List<RoomDto> roomDtos) {
        List<Room> rooms = new LinkedList<>();
        roomDtos.forEach(roomDto -> rooms.add(dtoToModel(roomDto)));

        return rooms;
    }
}
