package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * Entität einer Position
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Getter
@NoArgsConstructor
@Entity
public class Position extends DataObject {

    private double xCoordinate;
    private double yCoordinate;
    private double orientation;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param xCoordinate X-Koordinate
     * @param yCoordinate Y-Koordinate
     * @param orientation Drehwinkel
     * @param user {@link User}
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public Position(double xCoordinate, double yCoordinate, double orientation, User user,
                    Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.orientation = orientation;
    }
}
