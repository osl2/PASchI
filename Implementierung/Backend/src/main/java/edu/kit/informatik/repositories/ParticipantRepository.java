package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, ParticipantDto> {


    Optional<Participant> findParticipantById(String id);

    List<Optional<Participant>> findParticipantsByUser(User user);
}
