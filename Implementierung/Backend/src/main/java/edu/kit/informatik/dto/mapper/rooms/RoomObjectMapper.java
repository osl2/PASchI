package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.ChairDto;
import edu.kit.informatik.dto.userdata.rooms.RoomObjectDto;
import edu.kit.informatik.dto.userdata.rooms.TableDto;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.userdata.rooms.RoomObject;
import edu.kit.informatik.model.userdata.rooms.Table;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * {@link IModelDtoMapper} für {@link RoomObject} and {@link RoomObjectDto}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Service
public class RoomObjectMapper implements IModelDtoMapper<RoomObject, RoomObjectDto> {

    private final TableMapper tableMapper;
    private final ChairMapper chairMapper;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param tableMapper {@link TableMapper}
     * @param chairMapper {@link ChairMapper}
     */
    @Autowired
    public RoomObjectMapper(TableMapper tableMapper, ChairMapper chairMapper) {
        this.tableMapper = tableMapper;
        this.chairMapper = chairMapper;
    }

    @Override
    public RoomObjectDto modelToDto(RoomObject roomObject) {
        if (roomObject.isTable()) {
            return tableMapper.modelToDto((Table) roomObject);
        } else {
            return chairMapper.modelToDto((Chair) roomObject);
        }
    }

    @Override
    public List<RoomObjectDto> modelToDto(List<RoomObject> roomObjects) {
        List<RoomObjectDto> roomObjectDtos = new ArrayList<>();
        roomObjects.forEach(roomObject -> roomObjectDtos.add(modelToDto(roomObject)));

        return roomObjectDtos;
    }

    @Override
    public RoomObject dtoToModel(RoomObjectDto roomObjectDto) {
        if (roomObjectDto.isTable()) {
            return tableMapper.dtoToModel((TableDto) roomObjectDto);
        } else {
            return chairMapper.dtoToModel((ChairDto) roomObjectDto);
        }
    }

    @Override
    public List<RoomObject> dtoToModel(List<RoomObjectDto> roomObjectDtos) {
        List<RoomObject> roomObjects = new ArrayList<>();
        roomObjectDtos.forEach(roomObjectDto -> roomObjects.add(dtoToModel(roomObjectDto)));

        return roomObjects;
    }
}
