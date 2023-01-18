package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, UserDto> {

    Optional<User> findUserById(long id);

    Optional<User> findUserByEmail(String email);
}
