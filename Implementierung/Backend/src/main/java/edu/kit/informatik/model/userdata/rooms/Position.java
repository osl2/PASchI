package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Getter
@NoArgsConstructor
@Entity
public class Position extends DataObject {

    private double xCoordinate;
    private double yCoordinate;
    private double orientation;

    public Position(double xCoordinate, double yCoordinate, double orientation, User user,
                    Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.orientation = orientation;
        //this.user = user;
    }
}
