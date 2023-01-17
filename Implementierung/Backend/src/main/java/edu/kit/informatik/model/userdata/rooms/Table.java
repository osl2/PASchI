package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;

public class Table extends RoomObject {

    private double length;
    private double width;

    public Table(User user, Position position, double length, double width) {
        super(user, position);
        this.length = length;
        this.width = width;
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
