package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, InteractionDto> {

    Optional<Interaction> findInteractionById(String id);

    Optional<List<Interaction>> findInteractionBySession(Session session);
}
