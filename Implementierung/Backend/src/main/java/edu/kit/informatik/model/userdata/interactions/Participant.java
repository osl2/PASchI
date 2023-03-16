package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Entität eines Teilnehmers
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "participants")
public class Participant extends DataObject {

    private String firstName;
    private String lastName;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Course> courses;

    @Enumerated
    private ParticipantType participantType;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Interaction> interactions;

    private boolean visible;

    /**
     *
     * @param user {@link User}
     * @param firstName Vorname
     * @param lastName Nachname
     * @param participantType {@link ParticipantType}
     * @param visible {@code true}, wenn Teilnehmer angezeigt werden soll
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public Participant(User user, String firstName, String lastName,
                       ParticipantType participantType, boolean visible, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        this.firstName = firstName;
        this.lastName = lastName;
        this.participantType = participantType;
        this.visible = visible;
        this.courses = new ArrayList<>();
        this.interactions = new ArrayList<>();
    }

    /**
     * Rückgabe, ob Participant ein vom Typ {@link ParticipantType}-Student
     * @return {@code true}, wenn Participant vom Typ {@link ParticipantType}-Student
     */
    public boolean isStudent() {
        return this.participantType.equals(ParticipantType.Student);
    }

    /**
     * Rückgabe des {@link ParticipantType}
     * @return {@link ParticipantType}
     */
    public ParticipantType getParticipantType() {
        return participantType;
    }

    /**
     * Setzen des Vornamens
     * @param firstName Vorname
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Setzen des Nachnamens
     * @param lastName Nachname
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * Setzen der {@link Interaction Interaktionen}
     * @param interactions {@link List} von {@link Interaction Interaktionen}
     */
    public void setInteractions(List<Interaction> interactions) {
        this.interactions = interactions;
    }

    /**
     * Setzten der {@link Course Kurse}
     * @param courses {@link List} von {@link Course Kurse}
     */
    public void setCourses(List<Course> courses) {
        this.courses = courses;
    }

    /**
     * Setzten des booleschen Wertes visible
     * @param visible {@code true}, wenn Teilnehmer angezeigt werden soll
     */
    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
