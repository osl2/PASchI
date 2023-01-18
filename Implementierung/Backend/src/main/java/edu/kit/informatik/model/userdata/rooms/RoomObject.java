package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;

/**
 *
 */
public abstract class RoomObject {

    private String id;

    private User user;
    private Position position;

    public RoomObject(User user, Position position) {
        this.user = user;
        this.position = position;
    }

    public RoomObject() {
    }

    public String getId() {
        return id;
    }

    public abstract boolean isTable();

    public User getUser() {
        return user;
    }

    public Position getPosition() {
        return position;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setPosition(Position position) {
        this.position = position;
    }
}
