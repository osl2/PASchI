package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.NoArgsConstructor;

/**
 *
 */
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@NoArgsConstructor
public abstract class RoomObject {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    protected User user;

    @OneToOne
    protected Position position;

    public RoomObject(User user, Position position) {
        this.user = user;
        this.position = position;
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
