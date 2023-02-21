package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * Entität eines Tisches
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@Getter
@Entity
@jakarta.persistence.Table(name = "tables")
public class Table extends RoomObject {

    private double length;
    private double width;

    /**
     *
     * @param user {@link User}
     * @param position {@link Position}
     * @param length Länge
     * @param width Breite
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public Table(User user, Position position, double length, double width, Timestamp createdAt, Timestamp updatedAt) {
        super(user, position, createdAt, updatedAt);
        this.length = length;
        this.width = width;
    }

    @Override
    public boolean isTable() {
        return true;
    }

    /**
     * Setzen der Länge
     * @param length Länge
     */
    public void setLength(double length) {
        this.length = length;
    }

    /**
     * Setzen der Breite
     * @param width Breite
     */
    public void setWidth(double width) {
        this.width = width;
    }

}
