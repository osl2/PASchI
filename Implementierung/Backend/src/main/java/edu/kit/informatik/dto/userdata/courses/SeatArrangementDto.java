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

    private String id;
    private String userId;
    private String name;
    private Map<String, String> seatMap;
    private String roomId;
    private String courseId;
}
