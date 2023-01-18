package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Session;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "interactions")
public class Interaction {

    @Id
    @GeneratedValue
    private String id;

    @ManyToOne
    private User user;
    private String timeStamp;

    @ManyToOne
    private Session session;

    @ManyToOne
    private Participant from;

    @ManyToOne
    private Participant to;

    @ManyToOne
    private Category category;

    public Interaction(User user, String timeStamp, Session session, Participant from, Participant to,
                       Category category) {
        this.user = user;
        this.timeStamp = timeStamp;
        this.session = session;
        this.from = from;
        this.to = to;
        this.category = category;
    }

    public Interaction() {
    }

    public String getId() {
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
