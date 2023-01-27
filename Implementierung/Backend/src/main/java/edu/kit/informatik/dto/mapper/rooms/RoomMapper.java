package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.ChairDto;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.dto.userdata.rooms.RoomObjectDto;
import edu.kit.informatik.dto.userdata.rooms.TableDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.model.userdata.rooms.RoomObject;
import edu.kit.informatik.model.userdata.rooms.Table;
import edu.kit.informatik.repositories.ChairRepository;
import edu.kit.informatik.repositories.RoomRepository;
import edu.kit.informatik.repositories.TableRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomMapper implements IModelDtoMapper<Room, RoomDto, RoomDto> {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomObjectMapper roomObjectMapper;
    private final TableMapper tableMapper;
    private final ChairMapper chairMapper;

    @Autowired
    public RoomMapper(RoomRepository roomRepository, UserRepository userRepository, RoomObjectMapper roomObjectMapper,
                      TableMapper tableMapper, ChairMapper chairMapper) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.roomObjectMapper = roomObjectMapper;
        this.tableMapper = tableMapper;
        this.chairMapper = chairMapper;
    }

    @Override
    public RoomDto modelToDto(Room room) {
        List<RoomObjectDto> roomObjectDtos = new ArrayList<>();

        room.getTables().forEach(table -> roomObjectDtos.add(tableMapper.modelToDto(table)));
        room.getChairs().forEach(chair -> roomObjectDtos.add(chairMapper.modelToDto(chair)));

        return new RoomDto(
                room.getId(),
                room.getUser().getId(),
                room.getName(),
                roomObjectDtos
        );
    }

    @Override
    public List<RoomDto> modelToDto(List<Room> rooms) {
        List<RoomDto> roomDtos = new ArrayList<>();
        rooms.forEach(room -> roomDtos.add(modelToDto(room)));

        return roomDtos;
    }

    @Override
    public Room dtoToModel(RoomDto roomDto) {
        Room room = roomRepository.findRoomById(roomDto.getId()).orElseGet(Room::new);
        User user = userRepository.findUserById(roomDto.getUserId()).orElse(null);

        List<Chair> chairs = new ArrayList<>();
        List<Table> tables = new ArrayList<>();

        roomDto.getRoomObjects().forEach(roomObjectDto -> {
            RoomObject roomObject = roomObjectMapper.dtoToModel(roomObjectDto);

            if (roomObject.isTable()) {
                tables.add((Table) roomObject);
            } else {
                chairs.add((Chair) roomObject);
            }
        });

        room.setUser(user);
        room.setName(roomDto.getName());
        room.setChairs(chairs);
        room.setTables(tables);

        return room;
    }

    @Override
    public List<Room> dtoToModel(List<RoomDto> roomDtos) {
        List<Room> rooms = new ArrayList<>();
        roomDtos.forEach(roomDto -> rooms.add(dtoToModel(roomDto)));

        return rooms;
    }
}
