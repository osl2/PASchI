package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.rooms.RoomObjectDto;
import edu.kit.informatik.model.userdata.rooms.RoomObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomObjectRepository extends JpaRepository<RoomObject, RoomObjectDto> {
}
