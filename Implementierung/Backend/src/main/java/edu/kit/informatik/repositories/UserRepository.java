package edu.kit.informatik.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, UserDto> {

    @Query("SELECT user FROM User user WHERE user.id = ?1")
    Optional<User> findUserById(long id);

    @Query("SELECT user FROM User user WHERE user.email = ?1")
    Optional<User> findUserByEmail(String email);
}
