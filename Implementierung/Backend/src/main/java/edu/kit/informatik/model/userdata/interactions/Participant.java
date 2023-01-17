package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;

import java.util.LinkedList;
import java.util.List;

public abstract class Participant {

    private Long id;
    private User user;
    private String firstName;
    private String lastName;
    private List<Course> courses;
    private List<Interaction> interactions;

    public Participant(User user, String firstName, String lastName) {
        this.user = user;
        this.firstName = firstName;
        this.lastName = lastName;
        this.courses = new LinkedList<>();
        this.interactions = new LinkedList<>();
    }

    public abstract boolean isStudent();

    public Long getId() {
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
