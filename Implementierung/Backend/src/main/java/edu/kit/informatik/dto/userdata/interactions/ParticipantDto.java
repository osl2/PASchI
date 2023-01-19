package edu.kit.informatik.dto.userdata.interactions;

import edu.kit.informatik.model.userdata.interactions.ParticipantType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ParticipantDto {

    private String id;
    private String userId;
    private String firstName;
    private String lastName;

    private ParticipantType participantType;

    private List<String> courseIds;
    private List<String> interactionIds;
}
