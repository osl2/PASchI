package edu.kit.informatik.dto.userdata.rooms;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RoomDto {

    private Long id;
    private Long userId;
    private String name;
    private List<RoomObjectDto> roomObjects;
}
