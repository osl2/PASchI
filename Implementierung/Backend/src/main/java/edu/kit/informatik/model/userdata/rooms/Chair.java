package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.sql.Timestamp;

@Entity
@Table(name = "chairs")
public class Chair extends RoomObject {

    public Chair(User user, Position position, Timestamp createdAt, Timestamp updatedAt) {
        super(user, position, createdAt, updatedAt);
    }

    public Chair() {
        super();
    }

    public boolean isTable() {
        return false;
    }
}
