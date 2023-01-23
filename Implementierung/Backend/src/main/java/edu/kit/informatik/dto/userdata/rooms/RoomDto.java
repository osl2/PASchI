package edu.kit.informatik.dto.userdata.rooms;

import edu.kit.informatik.model.userdata.rooms.Room;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Data-Transfer-Object zur Klasse {@link Room}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RoomDto {

    private String id;
    private String userId;
    private String name;
    private List<RoomObjectDto> roomObjects;
}
