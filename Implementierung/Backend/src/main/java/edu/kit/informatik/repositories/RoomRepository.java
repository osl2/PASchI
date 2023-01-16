package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.rooms.RoomDto;
import edu.kit.informatik.model.userdata.rooms.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, RoomDto> {
}
