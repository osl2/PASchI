package edu.kit.informatik.dto.userdata.rooms;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
}
