package edu.kit.informatik.controller;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.service.UserService;
import org.springframework.security.core.Authentication;
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
 * Controller für {@link User Benutzer}.
 * TODO: Spring-Security
 *
 * @author ugqbo
 * @version 1.0
 */
@RestController
@RequestMapping(path = "/api/user")
public class UserController extends BaseController<User, UserDto, UserDto> {

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
    public UserDto add(@RequestBody UserDto userDto) {
        return super.add(userDto);
    }

    @Override
    @PutMapping
    public UserDto update(@RequestBody UserDto userDto) {
        return super.update(userDto);
    }

    @Override
    @GetMapping(path = "/{id}")
    public UserDto getById(@PathVariable("id") String id) {
        return super.getById(id);
    }

    @Override
    @GetMapping(path = "/admin")
    public List<UserDto> getAll() {
        return super.getAll();
    }

    @Override
    @DeleteMapping
    public String delete(@RequestParam String id) {
        return super.delete(id);
    }

    /**
     * Login des Benutzers
     * @param email E-Mail
     * @param password Password
     * @return {@link UserDto}
     */
    @PostMapping(path = "/login")
    public UserDto login(@RequestParam String email, @RequestParam  String password) {
        return this.userService.login(email, password);
    }

    /**
     * Rückgabe eines neuen JWT-Tokens bei Authentifizierung
     * @param authentication {@link Authentication}
     * @return {@link UserDto}
     */
    @PostMapping(path = "/token")
    public UserDto getToken(Authentication authentication) {
        return this.userService.getToken(authentication);
    }
}
