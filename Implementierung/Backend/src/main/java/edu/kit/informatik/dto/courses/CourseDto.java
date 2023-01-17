package edu.kit.informatik.dto.courses;

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

    private Long id;
    private Long userId;
    private String name;
    private String subject;
    private List<Long> sessionIds;
    private List<Long> participantIds;
    private List<Long> seatArrangementIds;
}
