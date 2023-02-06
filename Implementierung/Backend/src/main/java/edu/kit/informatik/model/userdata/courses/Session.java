package edu.kit.informatik.model.userdata.courses;

import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Interaction;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private User user;
    private String name;
    private String date;
    @ManyToOne
    private Course course;

    @OneToMany
    private List<Interaction> interactions;

    @ManyToOne
    private SeatArrangement seatArrangement;

    public Session(User user, String name, String date, Course course, SeatArrangement seatArrangement) {
        this.user = user;
        this.name = name;
        this.date = date;
        this.course = course;
        this.seatArrangement = seatArrangement;
        this.interactions = new ArrayList<>();
    }

    public void setSeatArrangement(SeatArrangement seatArrangement) {
        this.seatArrangement = seatArrangement;
    }

    public void setInteractions(List<Interaction> interactions) {
        this.interactions = interactions;
    }

    public void addInteraction(Interaction interaction) {
        this.interactions.add(interaction);
    }

    public void removeInteraction(Interaction interaction) {
        this.interactions.remove(interaction);
    }
}
