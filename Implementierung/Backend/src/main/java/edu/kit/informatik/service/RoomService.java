package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.rooms.RoomMapper;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.repositories.RoomRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Service für {@link Room Räume}.
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class RoomService extends BaseService<Room, RoomDto, RoomDto> {

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
        Room newRoom = this.roomRepository.save(this.mapper.dtoToModel(roomDto));

        return this.mapper.modelToDto(newRoom);
    }

    @Transactional
    @Override
    public RoomDto update(RoomDto roomDto) {
        Optional<Room> repositoryRoomOptional = this.roomRepository.findRoomById(roomDto.getId());

        if (repositoryRoomOptional.isEmpty()) {
            return null;
        }

        Room repositoyRoom = repositoryRoomOptional.get();
        Room newRoom = this.mapper.dtoToModel(roomDto);

        if (!newRoom.getName().equals(repositoyRoom.getName())) {
            repositoyRoom.setName(newRoom.getName());
        } else if (!newRoom.getTables().equals(repositoyRoom.getTables())) {
            repositoyRoom.setTables(newRoom.getTables());
        } else if (!newRoom.getChairs().equals(repositoyRoom.getChairs())) {
            repositoyRoom.setChairs(newRoom.getChairs());
        }

        return roomDto;
    }

    @Override
    public RoomDto getById(String id) {
        Optional<Room> roomOptional = this.roomRepository.findRoomById(id);

        return roomOptional.map(this.mapper::modelToDto).orElse(null);
    }

    @Override
    public List<RoomDto> getAll() {
        return mapper.modelToDto(this.roomRepository.findAll());
    }

    @Override
    public String delete(String id) {
        this.roomRepository.deleteById(id);

        return id;
    }
}
