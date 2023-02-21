package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity
@Table(name = "courses")
public class Course extends DataObject {

    /*
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private User user;

    */
    private String name;
    private String subject;

    @ManyToMany
    @Cascade(CascadeType.SAVE_UPDATE)
    private List<Participant> participants;

    @OneToMany
    @Cascade(CascadeType.ALL)
    private List<Session> sessions;

    @OneToMany
    private List<SeatArrangement> seatArrangements;

    public Course(User user, String name, String subject, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        //this.user = user;
        this.name = name;
        this.subject = subject;
        this.participants = new ArrayList<>();
        this.sessions = new ArrayList<>();
        this.seatArrangements = new ArrayList<>();
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setParticipants(List<Participant> participants) {
        this.participants = participants;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }

    public void setSeatArrangements(List<SeatArrangement> seatArrangements) {
        this.seatArrangements = seatArrangements;
    }

    public void addParticipant(Participant participant) {
        this.participants.add(participant);
    }

    public void removeParticipant(Participant participant) {
        this.participants.remove(participant);
    }

    public void addSession(Session session) {
        this.sessions.add(session);
    }

    public void removeSession(Session session) {
        this.sessions.remove(session);
    }

    public void addSeatArrangement(SeatArrangement seatArrangement) {
        this.seatArrangements.add(seatArrangement);
    }

    public void removeSeatArrangement(SeatArrangement seatArrangement) {
        this.seatArrangements.remove(seatArrangement);
    }
}
