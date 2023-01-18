package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
@jakarta.persistence.Table(name = "tables")
public class Table extends RoomObject {

    @Id
    @GeneratedValue
    private Long id;

    private double length;
    private double width;

    public Table(User user, Position position, double length, double width) {
        super(user, position);
        this.length = length;
        this.width = width;
    }

    public Table() {
        super();
    }

    public boolean isTable() {
        return true;
    }

    public double getLength() {
        return length;
    }

    public double getWidth() {
        return width;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public void setWidth(double width) {
        this.width = width;
    }
}
