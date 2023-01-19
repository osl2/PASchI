package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link User Benutzern}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface UserRepository extends JpaRepository<User, UserDto> {

    /**
     * Rückgabe von Optionals von {@link User}
     * @param id Id
     * @return {@link Optional} von {@link User}
     */
    Optional<User> findUserById(long id);

    /**
     * Rückgabe von Optionals von {@link User}
     * @param email E-Mail
     * @return {@link Optional} von {@link User}
     */
    Optional<User> findUserByEmail(String email);
}
