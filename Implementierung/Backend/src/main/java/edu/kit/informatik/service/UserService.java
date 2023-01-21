package edu.kit.informatik.service;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.model.Role;
import edu.kit.informatik.model.User;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service für {@link User Benutzer}
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class UserService extends BaseService<User, UserDto> {

    private final UserRepository userRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param userRepository {@link UserRepository}
     * @param userMapper {@link UserMapper}
     */
    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper) {
        super(userMapper);
        this.userRepository = userRepository;
    }

    @Override
    public UserDto add(UserDto userDto) {
        User user = this.mapper.dtoToModel(userDto);
        userRepository.save(user);

        return userDto;
    }


    @Override
    public UserDto update(UserDto userDto) {
        User user = this.mapper.dtoToModel(userDto);

        return userDto;
    }

    @Override
    public UserDto getById(String id) {
        Optional<User> userOptional = userRepository.findUserById(id);

        return userOptional.map(this.mapper::modelToDto).orElse(null);
    }

    @Override
    public List<UserDto> getAll() {
        return this.mapper.modelToDto(userRepository.findAll());
    }

    @Override
    public String delete(String id) {
        this.userRepository.deleteById(id);

        return id;
    }

    /**
     * Login des Benutzers
     * @param email E-Mail
     * @param password Password
     * @return {@link UserDto}
     */
    public UserDto login(String email, String password) {
        return null;
    }
}
