package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;

import java.util.LinkedList;
import java.util.List;

public class Course {

    private Long id;
    private User user;
    private String name;
    private String subject;
    private List<Participant> participants;
    private List<Session> sessions;
    private List<SeatArrangement> seatArrangements;

    public Course(User user, String name, String subject) {
        this.user = user;
        this.name = name;
        this.subject = subject;
        this.participants = new LinkedList<>();
        this.sessions = new LinkedList<>();
        this.seatArrangements = new LinkedList<>();
    }

    public Long getId() {
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
