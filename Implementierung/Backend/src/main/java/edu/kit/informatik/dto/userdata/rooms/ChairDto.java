package edu.kit.informatik.dto.userdata.rooms;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.rooms.Position;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * Data-Transfer-Object zur Klasse {@link Chair}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@NoArgsConstructor
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChairDto extends RoomObjectDto {

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param id Id
     * @param userId Id eines {@link User}
     * @param position {@link Position}
     * @param createdAt {@link Timestamp} beim Erstellen
     * @param updatedAt {@link Timestamp} beim Update
     */
    public ChairDto(String id, String userId, PositionDto position, Timestamp createdAt, Timestamp updatedAt) {
        super(id, userId, position, createdAt, updatedAt);
    }

    @Override
    public boolean isTable() {
        return false;
    }
}
