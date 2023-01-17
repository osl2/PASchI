package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.model.userdata.rooms.Room;

import java.util.List;

public class RoomMapper implements IModelDtoMapper<Room, RoomDto> {

    @Override
    public RoomDto modelToDto(Room room) {
        return null;
    }

    @Override
    public List<RoomDto> modelToDto(List<Room> rooms) {
        return null;
    }

    @Override
    public Room dtoToModel(RoomDto roomDto) {
        return null;
    }

    @Override
    public List<Room> dtoToModel(List<RoomDto> roomDtos) {
        return null;
    }
}
