package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatArrangementRepository extends JpaRepository<SeatArrangement, SeatArrangementDto> {

}
