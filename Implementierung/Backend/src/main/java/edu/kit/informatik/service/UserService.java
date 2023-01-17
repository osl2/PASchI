package edu.kit.informatik.service;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * Service für {@link User Benutzer}
 *
 * @author ugqbo
 * @version 1.0
 */
public class UserService implements BaseService<User, UserDto> {

    private final UserRepository userRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param userRepository {@link UserRepository}
     */
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDto add(UserDto userDto) {
        return null;
    }

    @Override
    public UserDto update(UserDto userDto) {
        return null;
    }

    @Override
    public UserDto getById(long id) {
        return null;
    }

    @Override
    public List<UserDto> getAll() {
        return null;
    }

    @Override
    public long delete(long id) {
        return 0;
    }
}
