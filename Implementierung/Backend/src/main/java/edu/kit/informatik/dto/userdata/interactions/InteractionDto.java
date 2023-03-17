package edu.kit.informatik.dto.userdata.interactions;


import edu.kit.informatik.model.userdata.interactions.Interaction;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.UUID;

/**
 * Data-Transfer-Object zur Klasse {@link Interaction}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InteractionDto implements Comparable<InteractionDto> {

    private String id;
    private String userId;
    private String timeStamp;
    private String sessionId;
    private String toParticipantId;
    private String fromParticipantId;
    private String categoryId;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    @Override
    public int compareTo(InteractionDto o) {
        UUID thisInteraction = UUID.fromString(this.id);
        UUID oInteraction = UUID.fromString(o.getId());

        return  thisInteraction.compareTo(oInteraction);
    }
}
