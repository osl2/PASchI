package edu.kit.informatik.controller;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.service.UserService;
import jakarta.websocket.server.PathParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller für {@link User Benutzer}.
 * TODO: Spring-Security
 *
 * @author ugqbo
 * @version 1.0
 */
@RestController
@RequestMapping(path = "/api/user")
public class UserController extends BaseController<User, UserDto> {

    private final UserService userService;

    /**
     * Konstruktor zum Erstellen eins Objektes der Klasse
     * @param userService {@link UserService}
     */
    public UserController(UserService userService) {
        super(userService);
        this.userService = userService;
    }

    @Override
    @PostMapping
    public UserDto add(UserDto userDto) {
        return super.add(userDto);
    }

    @Override
    @PutMapping
    public UserDto update(UserDto userDto) {
        return super.update(userDto);
    }

    @Override
    @GetMapping(path = "id")
    public UserDto getById(@PathParam("id") long id) {
        return super.getById(id);
    }

    @Override
    @GetMapping
    public List<UserDto> getAll() {
        return super.getAll();
    }

    @Override
    @DeleteMapping
    public long delete(long id) {
        return super.delete(id);
    }

    /**
     * Login des Benutzers
     * @param email E-Mail
     * @param password Password
     * @return {@link UserDto}
     */
    @PostMapping(path = "login")
    public UserDto login(String email, String password) {
        return this.userService.login(email, password);
    }
}
