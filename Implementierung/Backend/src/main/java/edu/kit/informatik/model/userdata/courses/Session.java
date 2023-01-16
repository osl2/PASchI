package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Interaction;

import java.util.LinkedList;
import java.util.List;

public class Session {

    private Long id;
    private User user;
    private String name;
    private String date;
    private final Course course;
    private List<Interaction> interactions;
    private SeatArrangement seatArrangement;

    public Session(User user, String name, String date, Course course, SeatArrangement seatArrangement) {
        this.user = user;
        this.name = name;
        this.date = date;
        this.course = course;
        this.seatArrangement = seatArrangement;
        this.interactions = new LinkedList<>();
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

    public String getDate() {
        return date;
    }

    public Course getCourse() {
        return course;
    }

    public List<Interaction> getInteractions() {
        return interactions;
    }

    public SeatArrangement getSeatArrangement() {
        return seatArrangement;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setSeatArrangement(SeatArrangement seatArrangement) {
        this.seatArrangement = seatArrangement;
    }

    public void setInteractions(List<Interaction> interactions) {
        this.interactions = interactions;
    }

    public void addInteraction(Interaction interaction) {
        this.interactions.add(interaction);
    }

    public void removeInteraction(Interaction interaction) {
        this.interactions.remove(interaction);
    }
}
