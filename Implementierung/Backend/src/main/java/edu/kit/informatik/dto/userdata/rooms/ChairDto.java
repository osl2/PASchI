package edu.kit.informatik.dto.userdata.rooms;

import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.rooms.Position;

/**
 * Data-Transfer-Object zur Klasse {@link Chair}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
public class ChairDto extends RoomObjectDto {

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param id Id
     * @param userId Id eines {@link User}
     * @param position {@link Position}
     */
    public ChairDto(String id, String userId, PositionDto position) {
        super(id, userId, position);
    }

    @Override
    public boolean isTable() {
        return false;
    }
}
