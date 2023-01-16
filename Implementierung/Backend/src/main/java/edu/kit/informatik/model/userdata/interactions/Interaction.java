package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Session;

public class Interaction {

    private Long id;
    private User user;
    private String timeStamp;
    private Session session;
    private Participant from;
    private Participant to;
    private Category category;

    public Interaction(User user, String timeStamp, Session session, Participant from, Participant to, Category category) {
        this.user = user;
        this.timeStamp = timeStamp;
        this.session = session;
        this.from = from;
        this.to = to;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public Session getSession() {
        return session;
    }

    public Participant getFrom() {
        return from;
    }

    public Participant getTo() {
        return to;
    }

    public Category getCategory() {
        return category;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public void setFrom(Participant from) {
        this.from = from;
    }

    public void setTo(Participant to) {
        this.to = to;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
