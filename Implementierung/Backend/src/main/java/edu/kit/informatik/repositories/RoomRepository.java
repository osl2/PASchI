package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.rooms.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, RoomDto> {

    Optional<Room> findRoomById(String id);

    Optional<List<Room>> findRoomsByUser(User user);
}
