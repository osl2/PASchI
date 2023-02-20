package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.rooms.RoomMapper;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.model.userdata.rooms.Table;
import edu.kit.informatik.repositories.ChairRepository;
import edu.kit.informatik.repositories.PositionRepository;
import edu.kit.informatik.repositories.RoomRepository;
import edu.kit.informatik.repositories.TableRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
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
    private final ChairRepository chairRepository;
    private final TableRepository tableRepository;
    private final PositionRepository positionRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param roomRepository     {@link RoomRepository}
     * @param roomMapper         {@link RoomMapper}
     * @param chairRepository {@link ChairRepository}
     * @param tableRepository {@link TableRepository}
     * @param positionRepository {@link PositionRepository}
     */
    public RoomService(RoomRepository roomRepository, RoomMapper roomMapper, ChairRepository chairRepository,
                                        TableRepository tableRepository, PositionRepository positionRepository) {
        super(roomMapper);
        this.roomRepository = roomRepository;
        this.chairRepository = chairRepository;
        this.tableRepository = tableRepository;
        this.positionRepository = positionRepository;
    }

    @Override
    public RoomDto add(RoomDto roomDto, Authentication authentication) {
        super.checkAuthorization(authentication, roomDto.getUserId());
        Room room = this.mapper.dtoToModel(roomDto);

        Room newRoom = this.roomRepository.save(saveRoomObjects(room));

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
            repositoyRoom.setTables(updateTables(repositoyRoom, newRoom));
        } else if (!newRoom.getChairs().equals(repositoyRoom.getChairs())) {
            repositoyRoom.setChairs(updateChair(repositoyRoom, newRoom));
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

    private Room saveRoomObjects(Room room) {
        Room newRoom = new Room(room.getUser(), room.getName(), room.getCreatedAt(), room.getUpdatedAt());
        for (int i = 0; i < room.getChairs().size(); i++) {
            room.getChairs().get(i).setPosition(positionRepository.save(room.getChairs().get(i).getPosition()));
            newRoom.addChair(chairRepository.save(room.getChairs().get(i)));
        }
        for (int i = 0; i < room.getTables().size(); i++) {
            room.getTables().get(i).setPosition(positionRepository.save(room.getTables().get(i).getPosition()));
            newRoom.addTable(tableRepository.save(room.getTables().get(i)));
        }
        return newRoom;
    }

    @Transactional
    private List<Table> updateTables(Room reposioryRoom, Room newRoom) {
        List<Table> returnTables = new ArrayList<>();

        for (Table newTable: newRoom.getTables()) {
            boolean found = false;
            for (Table repositoryTable: reposioryRoom.getTables())  {
                // Tische werden als gleich befunden, wenn der Erstell-Timestamp gleich ist
                if (repositoryTable.getCreatedAt().equals(newTable.getCreatedAt())) {
                    returnTables.add(newTable);
                    found = true;
                    break;
                }
            }
            if (!found) {
                returnTables.add(newTable);
                newTable.setPosition(positionRepository.save(newTable.getPosition()));
                tableRepository.save(newTable);
            }
        }

        return returnTables;
    }


    @Transactional
    private List<Chair> updateChair(Room reposioryRoom, Room newRoom) {
        List<Chair> returnChairs = new ArrayList<>();

        for (Chair newChair: newRoom.getChairs()) {
            boolean found = false;
            for (Chair repositoryChair: reposioryRoom.getChairs())  {
                // Stühle werden als gleich befunden, wenn der Erstell-Timestamp gleich ist
                if (repositoryChair.getCreatedAt().equals(newChair.getCreatedAt())) {
                    returnChairs.add(newChair);
                    Chair chair = chairRepository.findChairById(repositoryChair.getId())
                                                                                    .orElseThrow(null);
                    chair.setPosition(newChair.getPosition());
                    chair.setUpdatedAt(newChair.getUpdatedAt());

                    found = true;
                    break;
                }
            }
            if (!found) {
                returnChairs.add(newChair);
                newChair.setPosition(positionRepository.save(newChair.getPosition()));
                chairRepository.save(newChair);
            }
        }

        return returnChairs;
    }
}
