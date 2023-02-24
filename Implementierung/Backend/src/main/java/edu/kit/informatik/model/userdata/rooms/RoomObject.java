package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.sql.Timestamp;

/**
 * Abstrakte Klasse eines Raumobjektes
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Entity
@Getter
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@NoArgsConstructor
public abstract class RoomObject extends DataObject {

    @OneToOne
    @Cascade(CascadeType.ALL)
    private Position position;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param user {@link User}
     * @param position {@link Position}
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public RoomObject(User user, Position position, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        this.position = position;
    }

    /**
     * Rückgabe, ob Raumobjekt ein Tisch ist
     * @return {@code true}, wenn Raumobjekt ein Tisch ist
     */
    public abstract boolean isTable();

    /**
     * Setzen der {@link Position}
     * @param position {@link Position}
     */
    public void setPosition(Position position) {
        this.position = position;
    }
}
