package edu.kit.informatik.dto.userdata.courses;

import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;
import java.util.Map;
import java.util.UUID;

/**
 * Data-Transfer-Object zur Klasse {@link SeatArrangement}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@EqualsAndHashCode
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SeatArrangementDto implements Comparable<SeatArrangementDto> {

    private String id;
    private String userId;
    private String name;
    private Map<String, String> seatMap;
    private String roomId;
    private String courseId;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    @Override
    public int compareTo(SeatArrangementDto o) {
        UUID thisUser = UUID.fromString(this.id);
        UUID oUser = UUID.fromString(o.getId());

        return  thisUser.compareTo(oUser);
    }
}
