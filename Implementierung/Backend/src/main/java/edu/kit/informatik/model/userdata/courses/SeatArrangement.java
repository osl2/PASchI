package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.userdata.rooms.Room;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyJoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Map;

/**
 * Entität einer Sitzordnung
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "seatarrangements")
public class SeatArrangement extends DataObject {

    private String name;

    @OneToOne
    private Room room;

    @ManyToOne
    private Course course;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "chair_participant_mapping",
            joinColumns = @JoinColumn(name = "seatarrangementId"),
            inverseJoinColumns  = @JoinColumn(name = "participantId"))
    @MapKeyJoinColumn(name = "chairId")

    private Map<Chair, Participant> seatMap;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param user {@link User}
     * @param name Name
     * @param room {@link Room}
     * @param course {@link Course}
     * @param seatMap {@link Map} mit Key {@link Chair} und Value {@link Participant}
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public SeatArrangement(User user, String name, Room room, Course course, Map<Chair,
                            Participant> seatMap, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        this.name = name;
        this.room = room;
        this.course = course;
        this.seatMap = seatMap;
    }

    /**
     * Setzen der Sitzplatz-Map
     * @param seatMap {@link Map} mit Key {@link Chair} und Value {@link Participant}
     */
    public void setSeatMap(Map<Chair, Participant> seatMap) {
        this.seatMap = seatMap;
    }

    /**
     * Setzen des Namens
     * @param name Name
     */
    public void setName(String name) {
        this.name = name;
    }
}
