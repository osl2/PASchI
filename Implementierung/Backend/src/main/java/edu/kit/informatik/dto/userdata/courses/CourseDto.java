package edu.kit.informatik.dto.userdata.courses;

import edu.kit.informatik.model.userdata.courses.Course;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

/**
 * Data-Transfer-Object zur Klasse {@link Course}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0

 */
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CourseDto implements Comparable<CourseDto> {

    private String id;
    private String userId;
    private String name;
    private String subject;
    private List<String> sessionIds;
    private List<String> participantIds;
    private List<String> seatArrangementIds;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    @Override
    public int compareTo(CourseDto o) {
        UUID thisCourse = UUID.fromString(this.id);
        UUID oCourse = UUID.fromString(o.getId());

        return  thisCourse.compareTo(oCourse);
    }
}
