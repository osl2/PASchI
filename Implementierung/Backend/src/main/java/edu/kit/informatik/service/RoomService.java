package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.rooms.RoomMapper;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.repositories.RoomRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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

    private static final String ID_ATTRIBUTE = "userId";

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
    public RoomDto add(RoomDto roomDto, Authentication authentication) {
        super.checkAuthorization(authentication, roomDto.getUserId());
        Room newRoom = this.roomRepository.save(this.mapper.dtoToModel(roomDto));

        return this.mapper.modelToDto(newRoom);
    }

    @Transactional
    @Override
    public RoomDto update(RoomDto roomDto, Authentication authentication) {
        super.checkAuthorization(authentication, roomDto.getUserId());
        Optional<Room> repositoryRoomOptional = this.roomRepository.findRoomById(roomDto.getId());

        Room repositoyRoom = repositoryRoomOptional.orElseThrow(() ->
                                                            new EntityNotFoundException(Room.class, roomDto.getId()));
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
    public RoomDto getById(String id, Authentication authentication) {
        super.checkAuthorization(authentication, id);
        Optional<Room> roomOptional = this.roomRepository.findRoomById(id);

        return roomOptional.map(this.mapper::modelToDto).orElseThrow(() -> new EntityNotFoundException(Room.class, id));
    }

    @Override
    public List<RoomDto> getAll(Authentication authentication) {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        return mapper.modelToDto(this.roomRepository.findRoomsByUserId(
                                                                jAT.getTokenAttributes().get(ID_ATTRIBUTE).toString()));
    }

    @Override
    public String delete(String id, Authentication authentication) {
        super.checkAuthorization(authentication, id);
        Optional<Room> roomOptional = this.roomRepository.findRoomById(id);

        roomOptional.orElseThrow(() -> new EntityNotFoundException(Room.class, id));
        this.roomRepository.deleteById(id);

        return id;
    }
}
