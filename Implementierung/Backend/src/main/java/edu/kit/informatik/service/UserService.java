package edu.kit.informatik.service;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.model.User;
import edu.kit.informatik.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Service für {@link User Benutzer}
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class UserService extends BaseService<User, UserDto, UserDto> {

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
        User newUser = userRepository.save(user);

        return this.mapper.modelToDto(newUser);
    }

    @Transactional
    @Override
    public UserDto update(UserDto userDto) {

        Optional<User> repositoryUserOptional = userRepository.findUserById(userDto.getId());
        if (repositoryUserOptional.isEmpty()) {
            return null;
        }

        User repositoryUser = repositoryUserOptional.get();
        User newUser = this.mapper.dtoToModel(userDto);

        if (!newUser.getFirstName().equals(repositoryUser.getFirstName())) {
            repositoryUser.setFirstName(newUser.getFirstName());
        } else if (!newUser.getLastName().equals(repositoryUser.getLastName())) {
            repositoryUser.setLastName(repositoryUser.getLastName());
        } else if (!newUser.getPassword().equals(repositoryUser.getPassword())) {
            repositoryUser.setPassword(repositoryUser.getPassword());
        } else if (!newUser.isAuth() == repositoryUser.isAuth()) {
            repositoryUser.setAuth(repositoryUser.isAuth());
        } else if (!newUser.getRole().equals(repositoryUser.getRole())) {
            repositoryUser.setRole(repositoryUser.getRole());
        }

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
