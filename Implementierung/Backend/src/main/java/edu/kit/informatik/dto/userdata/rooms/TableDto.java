package edu.kit.informatik.dto.userdata.rooms;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class TableDto extends RoomObjectDto {

    private double length;
    private double width;

    public TableDto(Long id, Long userId, PositionDto position, double lentgh, double width) {
        super(id, userId, position);
        this.length = lentgh;
        this.width = width;
    }
}
