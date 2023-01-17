package edu.kit.informatik.dto.userdata.interactions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public abstract class ParticipantDto {

    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private List<Long> courseIds;
    private List<Long> interactionIds;
}
