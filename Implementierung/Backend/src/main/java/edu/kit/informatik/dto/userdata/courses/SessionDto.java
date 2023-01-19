package edu.kit.informatik.dto.userdata.courses;


import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SessionDto {

    private String id;
    private String userId;
    private String name;
    private String date;
    private String courseId;
    private String seatArrangementId;
    List<InteractionDto> interactions;
}
