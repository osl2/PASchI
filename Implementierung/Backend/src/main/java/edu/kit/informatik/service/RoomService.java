package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.mapper.rooms.RoomMapper;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.repositories.RoomRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service für {@link Room Räume}.
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class RoomService extends BaseService<Room, RoomDto> {

    private final RoomRepository roomRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param roomRepository {@link RoomRepository}
     * @param roomMapper {@link RoomMapper}
     */
    public RoomService(RoomRepository roomRepository, RoomMapper roomMapper) {
        super(roomMapper);
        this.roomRepository = roomRepository;
    }

    @Override
    public RoomDto add(RoomDto roomDto) {
        return null;
    }

    @Override
    public RoomDto update(RoomDto roomDto) {
        return null;
    }

    @Override
    public RoomDto getById(long id) {
        return null;
    }

    @Override
    public List<RoomDto> getAll() {
        return null;
    }

    @Override
    public long delete(long id) {
        return 0;
    }
}