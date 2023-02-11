package edu.kit.informatik.dto.userdata.rooms;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.rooms.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * Data-Transfer-Object zur Klasse {@link Table}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@NoArgsConstructor
@Getter
@Setter
public class TableDto extends RoomObjectDto {

    private double length;
    private double width;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param id Id
     * @param userId Id eines {@link User}
     * @param position {@link edu.kit.informatik.model.userdata.rooms.Position}
     * @param length Länge
     * @param width Breite
     * @param createdAt {@link Timestamp} beim Erstellen
     * @param updatedAt {@link Timestamp} beim Update
     */
    public TableDto(String id, String userId, PositionDto position, double length, double width,
                            Timestamp createdAt, Timestamp updatedAt) {
        super(id, userId, position, createdAt, updatedAt);
        this.length = length;
        this.width = width;
    }

    @Override
    public boolean isTable() {
        return true;
    }
}
