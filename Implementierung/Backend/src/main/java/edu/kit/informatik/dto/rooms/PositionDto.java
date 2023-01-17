package edu.kit.informatik.dto.rooms;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PositionDto {

    private Long id;
    private Long userId;
    private double xCoordinate;
    private double yCoordinate;
    private double orientation;
}
