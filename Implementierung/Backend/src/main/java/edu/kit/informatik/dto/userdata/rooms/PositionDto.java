package edu.kit.informatik.dto.userdata.rooms;

import edu.kit.informatik.model.userdata.rooms.Position;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * Data-Transfer-Object zur Klasse {@link Position}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PositionDto {

    private String id;
    private String userId;
    private double xCoordinate;
    private double yCoordinate;
    private double orientation;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
