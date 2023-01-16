package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;

import java.util.LinkedList;
import java.util.List;

public class Room {

    private Long id;
    private User user;
    private String name;
    private List<RoomObject> roomObjects;

    public Room(User user, String name) {
        this.user = user;
        this.name = name;
        this.roomObjects = new LinkedList<>();
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

    public void setUser(User user) {
        this.user = user;
    }

    public List<RoomObject> getRoomObjects() {
        return roomObjects;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRoomObjects(List<RoomObject> roomObjects) {
        this.roomObjects = roomObjects;
    }

    public void addRoomObject(RoomObject roomObject) {
        this.roomObjects.add(roomObject);
    }

    public void removeRoomObject(RoomObject roomObject) {
        this.roomObjects.remove(roomObject);
    }
}
