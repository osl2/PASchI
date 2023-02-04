package edu.kit.informatik.dto.userdata.rooms;

import edu.kit.informatik.model.userdata.rooms.Room;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.UUID;

/**
 * Data-Transfer-Object zur Klasse {@link Room}
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
public class RoomDto implements Comparable<RoomDto> {

    private String id;
    private String userId;
    private String name;
    private List<RoomObjectDto> roomObjects;

    @Override
    public int compareTo(RoomDto o) {
        UUID thisUser = UUID.fromString(this.id);
        UUID oUser = UUID.fromString(o.getId());

        return  thisUser.compareTo(oUser);
    }
}
