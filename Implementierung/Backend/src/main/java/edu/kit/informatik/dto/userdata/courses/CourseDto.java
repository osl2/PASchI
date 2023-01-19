package edu.kit.informatik.dto.userdata.courses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CourseDto {

    private String id;
    private String userId;
    private String name;
    private String subject;
    private List<String> sessionIds;
    private List<String> participantIds;
    private List<String> seatArrangementIds;
}
