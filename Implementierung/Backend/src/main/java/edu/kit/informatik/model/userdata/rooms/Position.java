package edu.kit.informatik.model.userdata.rooms;

public class Position {

    private Long id;
    private double xCoordinate;
    private double yCoordinate;
    private double orientation;

    public Position(double xCoordinate, double yCoordinate, double orientation) {
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.orientation = orientation;
    }

    public Long getId() {
        return id;
    }

    public double getXCoordinate() {
        return xCoordinate;
    }

    public double getYCoordinate() {
        return yCoordinate;
    }

    public double getOrientation() {
        return orientation;
    }

    public void setXCoordinate(double xCoordinate) {
        this.xCoordinate = xCoordinate;
    }

    public void setCCoordinate(double yCoordinate) {
        this.yCoordinate = yCoordinate;
    }

    public void setOrientation(double orientation) {
        this.orientation = orientation;
    }
}
