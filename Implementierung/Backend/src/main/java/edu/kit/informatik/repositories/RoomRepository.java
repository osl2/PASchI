package edu.kit.informatik.repositories;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.rooms.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Schnittstelle zur Datenbanktabelle mit {@link Room Räumen}
 *
 * @author ugqbo
 * @version 1.0
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    /**
     * Rückgabe eines {@link Optional} von {@link Room Räumen}
     * @param id Id
     * @return {@link Optional} von {@link Room}
     */
    Optional<Room> findRoomById(String id);

    /**
     * Rückgabe eines {@link Optional} von {@link Room Räumen}
     * @param userId eines {@link User}
     * @return {@link Optional} von {@link Room}
     */
    List<Room> findRoomsByUserId(String userId);
}
