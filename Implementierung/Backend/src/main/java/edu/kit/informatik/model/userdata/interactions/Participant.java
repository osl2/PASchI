package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "participants")
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private User user;
    private String firstName;
    private String lastName;
    @ManyToMany
    private List<Course> courses;

    @Enumerated
    private ParticipantType participantType;

    @ManyToMany
    private List<Interaction> interactions;

    public Participant(User user, String firstName, String lastName, ParticipantType participantType) {
        this.user = user;
        this.firstName = firstName;
        this.lastName = lastName;
        this.participantType = participantType;
        this.courses = new LinkedList<>();
        this.interactions = new LinkedList<>();
    }

    public Participant() {
    }

    public boolean isStudent() {
        return this.participantType.equals(ParticipantType.Student);
    }

    public String getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public List<Course> getCourses() {
        return courses;
    }

    public List<Interaction> getInteractions() {
        return interactions;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ParticipantType getParticipantType() {
        return participantType;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setCourses(List<Course> courses) {
        this.courses = courses;
    }

    public void setInteractions(List<Interaction> interactions) {
        this.interactions = interactions;
    }

    public void setParticipantType(ParticipantType participantType) {
        this.participantType = participantType;
    }

    public void addCourse(Course course) {
        this.courses.add(course);
    }

    public void removeCourse(Course course) {
        this.courses.remove(course);
    }

    public void addInteraction(Interaction interaction) {
        this.interactions.add(interaction);
    }

    public void removeInteraction(Interaction interaction) {
        this.interactions.remove(interaction);
    }
}