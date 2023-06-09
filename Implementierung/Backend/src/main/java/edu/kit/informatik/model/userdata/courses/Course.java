package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Entität eines Kurses
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@NoArgsConstructor
@Getter
@Entity
@Table(name = "courses")
public class Course extends DataObject {

    private String name;
    private String subject;

    @ManyToMany(fetch = FetchType.EAGER)
    @Cascade(CascadeType.SAVE_UPDATE)
    private List<Participant> participants;

    @OneToMany(fetch = FetchType.EAGER)
    @Cascade(CascadeType.ALL)
    private List<Session> sessions;

    @OneToMany(fetch = FetchType.EAGER)
    private List<SeatArrangement> seatArrangements;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param user {@link User}
     * @param name Name
     * @param subject Fach
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public Course(User user, String name, String subject, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        this.name = name;
        this.subject = subject;
        this.participants = new ArrayList<>();
        this.sessions = new ArrayList<>();
        this.seatArrangements = new ArrayList<>();
    }

    /**
     * Setzen des Namens
     * @param name Name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Setzen des Faches
     * @param subject Fach
     */
    public void setSubject(String subject) {
        this.subject = subject;
    }

    /**
     * Setzten der {@link Participant Teilnehmer}
     * @param participants {@link List Liste} von {@link Participant Teilnehmern}
     */
    public void setParticipants(List<Participant> participants) {
        this.participants = participants;
    }

    /**
     * Setzen der {@link Session Sitzung}
     * @param sessions {@link Session Sitzung}
     */
    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }

    /**
     * Setzen der {@link SeatArrangement Sitzordnung}
     * @param seatArrangements {@link SeatArrangement Sitzordnung}
     */
    public void setSeatArrangements(List<SeatArrangement> seatArrangements) {
        this.seatArrangements = seatArrangements;
    }
}
