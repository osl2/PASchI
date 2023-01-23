package edu.kit.informatik.dto.userdata.courses;

import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

/**
 * Data-Transfer-Object zur Klasse {@link SeatArrangement}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SeatArrangementDto {

    private String id;
    private String userId;
    private String name;
    private Map<String, String> seatMap;
    private String roomId;
    private String courseId;
}
