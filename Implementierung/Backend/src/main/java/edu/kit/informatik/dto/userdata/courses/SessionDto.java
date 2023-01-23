package edu.kit.informatik.dto.userdata.courses;


import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.model.userdata.courses.Session;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import edu.kit.informatik.model.userdata.interactions.Interaction;
import java.util.List;

/**
 * Data-Transfer-Object zur Klasse {@link Session}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SessionDto {

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
}
