package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.sql.Timestamp;


@EqualsAndHashCode(callSuper = true)
@Getter
@Entity
@jakarta.persistence.Table(name = "tables")
public class Table extends RoomObject {

    private double length;
    private double width;

    public Table(User user, Position position, double length, double width, Timestamp createdAt, Timestamp updatedAt) {
        super(user, position, createdAt, updatedAt);
        this.length = length;
        this.width = width;
    }

    public Table() {
        super();
    }

    public boolean isTable() {
        return true;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public void setWidth(double width) {
        this.width = width;
    }

}
