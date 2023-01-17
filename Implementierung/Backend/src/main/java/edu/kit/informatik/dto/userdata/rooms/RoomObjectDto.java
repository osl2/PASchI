package edu.kit.informatik.dto.userdata.rooms;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public abstract class RoomObjectDto {

    private Long id;
    private Long userId;
    private PositionDto position;
}
