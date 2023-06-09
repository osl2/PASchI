package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.rooms.RoomMapper;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.userdata.rooms.Position;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.model.userdata.rooms.Table;
import edu.kit.informatik.repositories.ChairRepository;
import edu.kit.informatik.repositories.PositionRepository;
import edu.kit.informatik.repositories.RoomRepository;
import edu.kit.informatik.repositories.SeatArrangementRepository;
import edu.kit.informatik.repositories.TableRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
    private final SeatArrangementRepository seatArrangementRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param roomRepository            {@link RoomRepository}
     * @param roomMapper                {@link RoomMapper}
     * @param chairRepository           {@link ChairRepository}
     * @param tableRepository           {@link TableRepository}
     * @param positionRepository        {@link PositionRepository}
     * @param seatArrangementRepository {@link SeatArrangementRepository}
     */
    public RoomService(RoomRepository roomRepository, RoomMapper roomMapper, ChairRepository chairRepository,
                       TableRepository tableRepository, PositionRepository positionRepository,
                       SeatArrangementRepository seatArrangementRepository) {
        super(roomMapper);
        this.roomRepository = roomRepository;
        this.chairRepository = chairRepository;
        this.tableRepository = tableRepository;
        this.positionRepository = positionRepository;
        this.seatArrangementRepository = seatArrangementRepository;
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

        Room repositoryRoom = repositoryRoomOptional.orElseThrow(() ->
                                                            new EntityNotFoundException(Room.class, roomDto.getId()));
        Room newRoom = this.mapper.dtoToModel(roomDto);

        if (!newRoom.getName().equals(repositoryRoom.getName())) {
            repositoryRoom.setName(newRoom.getName());
            repositoryRoom.setUpdatedAt(newRoom.getUpdatedAt());
        }
        if (!newRoom.getTables().equals(repositoryRoom.getTables())) {
            repositoryRoom.setTables(updateTables(repositoryRoom, newRoom));
            repositoryRoom.setUpdatedAt(newRoom.getUpdatedAt());
        }
        if (!newRoom.getChairs().equals(repositoryRoom.getChairs())) {
            repositoryRoom.setChairs(updateChair(repositoryRoom, newRoom));
            repositoryRoom.setUpdatedAt(newRoom.getUpdatedAt());
        }

        Optional<Room> newrepositoryRoomOptional = this.roomRepository.findRoomById(roomDto.getId());

        return mapper.modelToDto(newrepositoryRoomOptional.orElseThrow(() ->
                new EntityNotFoundException(Room.class, roomDto.getId())));
    }

    @Override
    public RoomDto getById(String id, Authentication authentication) {
        Optional<Room> roomOptional = this.roomRepository.findRoomById(id);
        Room room = roomOptional.orElseThrow(() -> new EntityNotFoundException(Room.class, id));
        super.checkAuthorization(authentication, room.getUser().getId());

        return this.mapper.modelToDto(room);
    }

    @Override
    public List<RoomDto> getAll(Authentication authentication) {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        return mapper.modelToDto(this.roomRepository.findRoomsByUserId(
                                                                jAT.getTokenAttributes().get(ID_ATTRIBUTE).toString()));
    }

    @Override
    public String delete(String id, Authentication authentication) {
        Optional<Room> roomOptional = this.roomRepository.findRoomById(id);
        Room room = roomOptional.orElseThrow(() -> new EntityNotFoundException(Room.class, id));
        super.checkAuthorization(authentication, room.getUser().getId());

        return delete(room);
    }

    /**
     * Löschen eines {@link Room}
     * -->dient zum Löschen fpr andere Services
     * @param room {@link Room}
     * @return Id des {@link Room}
     */
    protected String delete(Room room) {
        List<SeatArrangement> seatArrangements = seatArrangementRepository.findSeatArrangementByRoom(room);
        if (seatArrangements.size() != 0) {
            throw new IllegalArgumentException("Es müssen zuvor alle Sessions mit den zu dem Raum gehörenden"
                    + "Sitzordnungen gelöscht werden");
        }

        List<Chair> chairs = room.getChairs();
        for (Chair chair: chairs) {
            Position position = chair.getPosition();
            chairRepository.deleteById(chair.getId());
            positionRepository.deleteById(position.getId());
        }

        List<Table> tables = room.getTables();
        for (Table table: tables) {
            Position position = table.getPosition();
            tableRepository.deleteById(table.getId());
            positionRepository.deleteById(position.getId());
        }

        this.roomRepository.deleteById(room.getId());
        return room.getId();
    }

    private Room saveRoomObjects(Room room) {
        Room newRoom = new Room(room.getUser(), room.getName(), room.isVisible(), room.getCreatedAt(),
                                room.getUpdatedAt());
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

    private List<Table> updateTables(Room repositoryRoom, Room newRoom) {
        List<Table> returnTables = new ArrayList<>();

        for (Table newTable: newRoom.getTables()) {
            boolean found = false;
            for (Table repositoryTable: repositoryRoom.getTables())  {
                // Tische werden als gleich befunden, wenn der Erstell-Timestamp gleich ist
                if (repositoryTable.getCreatedAt().equals(newTable.getCreatedAt())) {
                    repositoryTable.setWidth(newTable.getWidth());
                    repositoryTable.setLength(newTable.getLength());
                    Position oldPosition = repositoryTable.getPosition();

                    oldPosition.setXCoordinate(newTable.getPosition().getXCoordinate());
                    oldPosition.setYCoordinate(newTable.getPosition().getYCoordinate());
                    oldPosition.setOrientation(newTable.getPosition().getOrientation());

                    returnTables.add(repositoryTable);

                    found = true;
                    break;
                }
            }
            if (!found) {
                returnTables.add(newTable);
            }
        }

        if (returnTables.size() < repositoryRoom.getTables().size()) {
            for (Table repositoryTable: repositoryRoom.getTables()) {
                boolean found = false;
                for (Table returnTable: returnTables)  {
                    // Tische werden als gleich befunden, wenn der Erstell-Timestamp gleich ist
                    if (repositoryTable.getCreatedAt().equals(returnTable.getCreatedAt())) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    returnTables.remove(repositoryTable);
                    tableRepository.deleteById(repositoryTable.getId());
                }
            }
        }

        return returnTables;
    }

    private List<Chair> updateChair(Room repositoryRoom, Room newRoom) {
        List<Chair> returnChairs = new ArrayList<>();

        for (Chair newChair: newRoom.getChairs()) {
            boolean found = false;
            for (Chair repositoryChair: repositoryRoom.getChairs())  {
                // Stühle werden als gleich befunden, wenn der Erstell-Timestamp gleich ist
                if (repositoryChair.getCreatedAt().equals(newChair.getCreatedAt())) {
                    Position oldPosition = repositoryChair.getPosition();

                    oldPosition.setXCoordinate(newChair.getPosition().getXCoordinate());
                    oldPosition.setYCoordinate(newChair.getPosition().getYCoordinate());
                    oldPosition.setOrientation(newChair.getPosition().getOrientation());

                    returnChairs.add(repositoryChair);

                    found = true;
                    break;
                }
            }
            if (!found) {
                returnChairs.add(newChair);
            }
        }

        if (returnChairs.size() < repositoryRoom.getChairs().size()) {
            for (Chair repositoryChair: repositoryRoom.getChairs()) {
                boolean found = false;
                for (Chair returnChair: returnChairs)  {
                    // Tische werden als gleich befunden, wenn der Erstell-Timestamp gleich ist
                    if (repositoryChair.getCreatedAt().equals(returnChair.getCreatedAt())) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    returnChairs.remove(repositoryChair);
                    chairRepository.deleteById(repositoryChair.getId());
                }
            }
        }

        return returnChairs;
    }
}
