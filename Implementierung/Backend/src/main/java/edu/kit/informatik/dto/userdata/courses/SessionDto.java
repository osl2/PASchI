package edu.kit.informatik.dto.userdata.courses;


import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.model.userdata.courses.Session;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import lombok.ToString;

import java.util.List;
import java.util.UUID;

/**
 * Data-Transfer-Object zur Klasse {@link Session}
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
public class SessionDto implements Comparable<SessionDto> {

    /**
     * Liste von {@link InteractionDto}
     */
    List<InteractionDto> interactions;

    private String id;
    private String userId;
    private String name;
    private String date;
    private String courseId;
    private String seatArrangementId;

    @Override
    public int compareTo(SessionDto o) {
        UUID thisUser = UUID.fromString(this.id);
        UUID oUser = UUID.fromString(o.getId());

        return  thisUser.compareTo(oUser);
    }
}
