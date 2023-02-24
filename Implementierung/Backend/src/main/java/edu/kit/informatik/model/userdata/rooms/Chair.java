package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * Entität eines Stuhls
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@NoArgsConstructor
@Entity
@Table(name = "chairs")
public class Chair extends RoomObject {
    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param user {@link User}
     * @param position {@link Position}
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public Chair(User user, Position position, Timestamp createdAt, Timestamp updatedAt) {
        super(user, position, createdAt, updatedAt);
    }

    @Override
    public boolean isTable() {
        return false;
    }
}
