package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.model.userdata.rooms.RoomObject;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKey;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.util.Map;

@Entity
@Table(name = "seatarrangements")
public class SeatArrangement {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private User user;
    private String name;

    @OneToOne
    private Room room;

    @ManyToOne
    private Course course;

    @OneToMany(cascade = CascadeType.ALL)
    @CollectionTable(name = "roomobject_participant_mapping")
    @MapKey(name = "seatMap")
    private Map<RoomObject, Participant> seatMap;

    public SeatArrangement(User user, String name, Room room, Course course, Map<RoomObject, Participant> seatMap) {
        this.user = user;
        this.name = name;
        this.room = room;
        this.course = course;
        this.seatMap = seatMap;
    }

    public SeatArrangement() {
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
