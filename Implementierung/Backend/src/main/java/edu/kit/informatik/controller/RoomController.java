package edu.kit.informatik.controller;

import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.service.RoomService;
import jakarta.websocket.server.PathParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller für {@link Room Räume}.
 *
 * @author ugqbo
 * @version 1.0
 */
@RestController
@RequestMapping(path = "/api/room")
public class RoomController extends BaseController<Room, RoomDto> {

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param roomService {@link RoomService}
     */
    public RoomController(RoomService roomService) {
        this.service = roomService;
    }

    @Override
    @PostMapping
    public RoomDto add(RoomDto roomDto) {
        return super.add(roomDto);
    }

    @Override
    @PutMapping
    public RoomDto update(RoomDto roomDto) {
        return super.update(roomDto);
    }

    @Override
    @GetMapping(path = "id")
    public RoomDto getById(@PathParam("id") long id) {
        return super.getById(id);
    }

    @Override
    @GetMapping
    public List<RoomDto> getAll() {
        return super.getAll();
    }

    @Override
    @DeleteMapping
    public long delete(long id) {
        return super.delete(id);
    }
}