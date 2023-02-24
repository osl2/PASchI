package edu.kit.informatik.controller;

import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.service.RoomService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller für {@link Room Räume}.
 *
 * @author ugqbo
 * @version 1.0
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/room")
public class RoomController extends BaseController<Room, RoomDto, RoomDto> {

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param roomService {@link RoomService}
     */
    public RoomController(RoomService roomService) {
        super(roomService);
    }

    @Override
    @PostMapping
    public RoomDto add(@RequestBody RoomDto roomDto, Authentication authentication) {
        return super.add(roomDto, authentication);
    }

    @Override
    @PutMapping
    public RoomDto update(@RequestBody RoomDto roomDto, Authentication authentication) {
        return super.update(roomDto, authentication);
    }

    @Override
    @GetMapping(path = "/{id}")
    public RoomDto getById(@PathVariable("id") String id, Authentication authentication) {
        return super.getById(id, authentication);
    }

    @Override
    @GetMapping
    public List<RoomDto> getAll(Authentication authentication) {
        return super.getAll(authentication);
    }

    @Override
    @DeleteMapping
    public String delete(@RequestParam String id, Authentication authentication) {
        return super.delete(id, authentication);
    }
}
