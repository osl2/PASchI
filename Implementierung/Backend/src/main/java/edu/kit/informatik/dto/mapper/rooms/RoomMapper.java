package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.model.userdata.rooms.Table;
import edu.kit.informatik.repositories.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class RoomMapper implements IModelDtoMapper<Room, RoomDto> {

    private final RoomRepository roomRepository;
    //private final RoomObjectMapper roomObjectMapper;


    public RoomMapper(RoomRepository roomRepository/*, RoomObjectMapper roomObjectMapper*/) {
        this.roomRepository = roomRepository;
        //this.roomObjectMapper = roomObjectMapper;
    }

    @Override
    public RoomDto modelToDto(Room room) {
        List<Table> tables = new LinkedList<>();
        List<Chair> chairs = new LinkedList<>();
        //room.getTables().forEach(roomObject -> tables.add(roomObjectMapper.modelToDto(roomObject)));
        /*
        return new RoomDto(
                room.getId(),
                room.getUser().getId(),
                room.getName()

        );

         */

        return null;
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
