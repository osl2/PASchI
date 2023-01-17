package edu.kit.informatik.dto.userdata.courses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SeatArrangementDto {

    private Long id;
    private Long userId;
    private String name;
    private Map<Long, Long> seatMap;
    private Long roomId;
    private Long courseId;
}
