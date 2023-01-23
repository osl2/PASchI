package edu.kit.informatik.dto.userdata.interactions;

import edu.kit.informatik.model.userdata.interactions.Participant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Data-Transfer-Object zur Klasse {@link Participant}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ParticipantDto {

    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private ParticipantTypeDto participantType;
    private List<String> courseIds;
    private List<String> interactionIds;
}
