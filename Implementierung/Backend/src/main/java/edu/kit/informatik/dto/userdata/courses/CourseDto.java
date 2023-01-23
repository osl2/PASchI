package edu.kit.informatik.dto.userdata.courses;

import edu.kit.informatik.model.userdata.courses.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Data-Transfer-Object zur Klasse {@link Course}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
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
