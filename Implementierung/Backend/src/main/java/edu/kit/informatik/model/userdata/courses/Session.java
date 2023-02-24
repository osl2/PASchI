package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Entität einer Sitzung
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "sessions")
public class Session extends DataObject {

    private String name;
    private String date;
    @ManyToOne
    private Course course;

    @OneToMany
    private List<Interaction> interactions;

    @ManyToOne
    private SeatArrangement seatArrangement;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param user {@link User}
     * @param name Name
     * @param date Datum
     * @param course {@link Course}
     * @param seatArrangement {@link SeatArrangement}
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public Session(User user, String name, String date, Course course,
                   SeatArrangement seatArrangement, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        this.name = name;
        this.date = date;
        this.course = course;
        this.seatArrangement = seatArrangement;
        this.interactions = new ArrayList<>();
    }

    /**
     * Setzen des Namens
     * @param name Name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Setzen der {@link SeatArrangement Sitzordnmung}
     * @param seatArrangement {@link SeatArrangement Sitzordnmung}
     */
    public void setSeatArrangement(SeatArrangement seatArrangement) {
        this.seatArrangement = seatArrangement;
    }

    /**
     * Setzen der {@link Interaction Interaktionen}
     * @param interactions {@link List} von {@link Interaction Interaktionen}
     */
    public void setInteractions(List<Interaction> interactions) {
        this.interactions = interactions;
    }

    /**
     * Hinzufügen einer {@link Interaction Interaktion}
     * @param interaction {@link Interaction Interaktion}
     */
    public void addInteraction(Interaction interaction) {
        this.interactions.add(interaction);
    }

    /**
     * Entfernen einer {@link Interaction Interaktion}
     * @param interaction {@link Interaction Interaktion}
     */
    public void removeInteraction(Interaction interaction) {
        this.interactions.remove(interaction);
    }
}
