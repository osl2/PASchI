package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatArrangementRepository extends JpaRepository<SeatArrangement, SeatArrangementDto> {

    Optional<SeatArrangement> findSeatArrangementById(String id);

    Optional<List<SeatArrangement>> findSeatArrangementsByCourse(Course course);

}
