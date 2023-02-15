package edu.kit.informatik.service;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.model.User;
import edu.kit.informatik.repositories.UserRepository;
import edu.kit.informatik.security.TokenService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Service für {@link User Benutzer}
 *
 * TODO: Fehler werfen, wie Entity schon in DB, Entity nicht vorhanden...
 *
 * @author ugqbo
 * @version 1.0
 */

@Component
public class UserService extends BaseService<User, UserDto, UserDto> {

    private final UserRepository userRepository;

    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param userRepository        {@link UserRepository}
     * @param userMapper            {@link UserMapper}
     * @param tokenService          {@link TokenService}
     * @param authenticationManager {@link AuthenticationManager}
     */
    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper,
                       TokenService tokenService, AuthenticationManager authenticationManager) {
        super(userMapper);
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserDto add(UserDto userDto, Authentication authentication) {
        User user = this.mapper.dtoToModel(userDto);

        Optional<User> userOptional = userRepository.findUserByEmail(user.getEmail());

        if (userOptional.isPresent()) {
            throw new IllegalArgumentException("Email already taken");
        }

        String newPassword = new BCryptPasswordEncoder().encode(user.getPassword());

        user.setPassword("{bcrypt}" + newPassword);

        User newUser = userRepository.save(user);

        return this.mapper.modelToDto(newUser);
    }

    @Transactional
    @Override
    public UserDto update(UserDto userDto, Authentication authentication) {

        Optional<User> repositoryUserOptional = userRepository.findUserById(userDto.getId());
        if (repositoryUserOptional.isEmpty()) {
            throw new IllegalArgumentException("User with ID " + userDto.getId() + " not found.");
        }

        User repositoryUser = repositoryUserOptional.get();
        User newUser = this.mapper.dtoToModel(userDto);

        if (!newUser.getFirstName().equals(repositoryUser.getFirstName())) {
            repositoryUser.setFirstName(newUser.getFirstName());
        }
        if (!newUser.getLastName().equals(repositoryUser.getLastName())) {
            repositoryUser.setLastName(newUser.getLastName());
        }
        if (!newUser.getPassword().equals(repositoryUser.getPassword())) {
            repositoryUser.setPassword(newUser.getPassword());
        }

        return mapper.modelToDto(repositoryUser);
    }

    @Override
    public UserDto getById(String id, Authentication authentication) {
        Optional<User> userOptional = userRepository.findUserById(id);

        if (userOptional.isPresent()) {
            return this.mapper.modelToDto(userOptional.get());
        } else {
            throw new IllegalArgumentException("User with ID " + id + " not found.");
        }
    }

    @Override
    public List<UserDto> getAll(Authentication authentication) {
        return this.mapper.modelToDto(userRepository.findAll());
    }

    @Override
    public String delete(String id, Authentication authentication) {
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
        UsernamePasswordAuthenticationToken uPAT = new UsernamePasswordAuthenticationToken(email, password);

        Authentication authentication = authenticationManager.authenticate(uPAT);

        User user = (User) authentication.getPrincipal();
        UserDto userDto = this.mapper.modelToDto(user);
        userDto.setToken(tokenService.generateToken(authentication));

        return userDto;
    }

    /**
     * Rückgabe eines neuen JWT-Tokens bei Authentifizierung
     * @param authentication {@link Authentication}
     * @return {@link UserDto}
     */
    public UserDto getToken(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UserDto userDto = this.mapper.modelToDto(user);
        userDto.setToken(tokenService.generateToken(authentication));

        return userDto;
    }

    public UserDto adminUpdate(UserDto userDto) {
        Optional<User> repositoryUserOptional = userRepository.findUserById(userDto.getId());
        if (repositoryUserOptional.isEmpty()) {
            throw new IllegalArgumentException("User with ID " + userDto.getId() + " not found.");
        }

        User repositoryUser = repositoryUserOptional.get();
        User newUser = this.mapper.dtoToModel(userDto);

        if (!newUser.isAuth() == repositoryUser.isAuth()) {
            repositoryUser.setAuth(newUser.isAuth());
        }
        if (newUser.getRole() != repositoryUser.getRole()) {
            repositoryUser.setRole(newUser.getRole());
        }

        return mapper.modelToDto(repositoryUser);
    }
}
