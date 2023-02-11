package edu.kit.informatik.dto.userdata.interactions;

import edu.kit.informatik.model.userdata.interactions.Participant;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

/**
 * Data-Transfer-Object zur Klasse {@link Participant}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */

@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ParticipantDto implements Comparable<ParticipantDto> {

    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private ParticipantTypeDto participantType;
    private List<String> courseIds;
    private List<String> interactionIds;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    @Override
    public int compareTo(ParticipantDto o) {
        UUID thisUser = UUID.fromString(this.id);
        UUID oUser = UUID.fromString(o.getId());

        return  thisUser.compareTo(oUser);
    }
}
