package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.RoomObjectDto;
import edu.kit.informatik.model.userdata.rooms.RoomObject;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomObjectMapper implements IModelDtoMapper<RoomObject, RoomObjectDto> {

    @Override
    public RoomObjectDto modelToDto(RoomObject roomObject) {
        return null;
    }

    @Override
    public List<RoomObjectDto> modelToDto(List<RoomObject> roomObjects) {
        return null;
    }

    @Override
    public RoomObject dtoToModel(RoomObjectDto roomObjectDto) {
        return null;
    }

    @Override
    public List<RoomObject> dtoToModel(List<RoomObjectDto> roomObjectDtos) {
        return null;
    }
}
