package edu.kit.informatik.repositories;

import edu.kit.informatik.dto.interactions.InteractionDto;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, InteractionDto> {
}
