package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue
    private String id;

    @ManyToOne
    private User user;
    private String name;
    private String subject;

    @ManyToMany
    private List<Participant> participants;

    @OneToMany
    private List<Session> sessions;

    @OneToMany
    private List<SeatArrangement> seatArrangements;

    public Course(User user, String name, String subject) {
        this.user = user;
        this.name = name;
        this.subject = subject;
        this.participants = new LinkedList<>();
        this.sessions = new LinkedList<>();
        this.seatArrangements = new LinkedList<>();
    }

    public Course() {
    }

    public String getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getName() {
        return name;
    }

    public String getSubject() {
        return subject;
    }

    public List<Participant> getParticipants() {
        return participants;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public List<SeatArrangement> getSeatArrangements() {
        return seatArrangements;
    }

    public void setUser(User user) {
        this.user = user;
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
