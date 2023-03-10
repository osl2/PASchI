package edu.kit.informatik.security;

import edu.kit.informatik.model.User;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Unterklasse des {@link UserDetailsService}.
 * Sucht {@link User} anhand seiner E-Mail aus dem {@link UserRepository}
 *
 * @author ugqbo
 * @version 1.0
 */
@Service
public class MyUserDetailsService implements UserDetailsService {

    private static final String USER_NOT_FOUND = "User mit Email '%s' nicht gefunden";

    private final UserRepository userRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param userRepository {@link UserRepository}
     */
    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findUserByEmail(username);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException(String.format(USER_NOT_FOUND, username));
        }

        return userOptional.get();

    }
}
