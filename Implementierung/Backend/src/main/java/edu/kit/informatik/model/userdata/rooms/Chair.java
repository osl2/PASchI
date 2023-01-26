package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "chairs")
public class Chair extends RoomObject {
    /*
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

     */

    public Chair(User user, Position position) {
        super(user, position);
    }

    public Chair() {
        super();
    }

    public boolean isTable() {
        return false;
    }
}
