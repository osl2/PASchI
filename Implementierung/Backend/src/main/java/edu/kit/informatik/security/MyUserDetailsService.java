package edu.kit.informatik.security;

import edu.kit.informatik.model.User;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    //@Autowired
    private final UserRepository userRepository;

    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findUserByEmail(username);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException(username);
        }

        return userOptional.get();

    }
}
