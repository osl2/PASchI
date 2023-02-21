package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "participants")
public class Participant extends DataObject {

    private String firstName;
    private String lastName;
    @ManyToMany
    private List<Course> courses;

    @Enumerated
    private ParticipantType participantType;

    @ManyToMany
    private List<Interaction> interactions;

    public Participant(User user, String firstName, String lastName,
                       ParticipantType participantType, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        //this.user = user;
        this.firstName = firstName;
        this.lastName = lastName;
        this.participantType = participantType;
        this.courses = new ArrayList<>();
        this.interactions = new ArrayList<>();
    }

    public boolean isStudent() {
        return this.participantType.equals(ParticipantType.Student);
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


    public void setInteractions(List<Interaction> interactions) {
        this.interactions = interactions;
    }

    public void setCourses(List<Course> courses) {
        this.courses = courses;
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
