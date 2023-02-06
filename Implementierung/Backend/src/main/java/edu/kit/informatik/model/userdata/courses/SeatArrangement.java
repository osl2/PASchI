package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.userdata.rooms.Room;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyJoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "seatarrangements")
public class SeatArrangement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne

    private User user;
    private String name;

    @OneToOne
    private Room room;

    @ManyToOne
    private Course course;

    @OneToMany(cascade = CascadeType.ALL)
    //@CollectionTable(name = "chair_participant_mapping")
    //@MapKey
    @JoinTable(name = "chair_participant_mapping",
            joinColumns = @JoinColumn(name = "seatarrangementId"),
            inverseJoinColumns  = @JoinColumn(name = "participantId"))
    @MapKeyJoinColumn(name = "chairId")

    private Map<Chair, Participant> seatMap;

    public SeatArrangement(User user, String name, Room room, Course course, Map<Chair, Participant> seatMap) {
        this.user = user;
        this.name = name;
        this.room = room;
        this.course = course;
        this.seatMap = seatMap;
    }

    public Participant getParticipantForSeat(Chair seat) {
        return seatMap.get(seat);
    }

    public void setSeatMap(Map<Chair, Participant> seatMap) {
        this.seatMap = seatMap;
    }

    public void setSeat(Chair seat, Participant participant) {
        this.seatMap.put(seat, participant);
    }
}
