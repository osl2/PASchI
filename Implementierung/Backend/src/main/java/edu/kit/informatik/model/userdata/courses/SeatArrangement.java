package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.model.userdata.rooms.RoomObject;

import java.util.Map;

public class SeatArrangement {

    private Long id;
    private User user;
    private String name;
    private Room room;
    private Course course;
    private Map<RoomObject, Participant> seatMap;

    public SeatArrangement(User user, String name, Room room, Course course, Map<RoomObject, Participant> seatMap) {
        this.user = user;
        this.name = name;
        this.room = room;
        this.course = course;
        this.seatMap = seatMap;
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

    public Room getRoom() {
        return room;
    }

    public Course getCourse() {
        return course;
    }

    public Map<RoomObject, Participant> getSeatMap() {
        return seatMap;
    }

    public Participant getParticipantForSeat(RoomObject seat) {
        return seatMap.get(seat);
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setSeatMap(Map<RoomObject, Participant> seatMap) {
        this.seatMap = seatMap;
    }

    public void setSeat(RoomObject seat, Participant participant) {
        this.seatMap.put(seat, participant);
    }
}
