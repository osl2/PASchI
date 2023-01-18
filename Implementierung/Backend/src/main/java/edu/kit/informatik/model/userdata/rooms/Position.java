package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne
    private User user;
    private double xCoordinate;
    private double yCoordinate;
    private double orientation;

    public Position(double xCoordinate, double yCoordinate, double orientation) {
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.orientation = orientation;
    }

    public Position() {

    }

    public String getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public double getXCoordinate() {
        return xCoordinate;
    }

    public double getYCoordinate() {
        return yCoordinate;
    }

    public double getOrientation() {
        return orientation;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setXCoordinate(double xCoordinate) {
        this.xCoordinate = xCoordinate;
    }

    public void setCCoordinate(double yCoordinate) {
        this.yCoordinate = yCoordinate;
    }

    public void setOrientation(double orientation) {
        this.orientation = orientation;
    }
}
