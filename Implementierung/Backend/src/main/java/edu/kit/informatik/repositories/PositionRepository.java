package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.rooms.PositionDto;
import edu.kit.informatik.model.userdata.rooms.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PositionRepository extends JpaRepository<Position, PositionDto> {

    Optional<Position> findPositionById(String id);

}
