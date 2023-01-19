package edu.kit.informatik.dto.userdata.interactions;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InteractionDto {

    private String id;
    private String userId;
    private String timeStamp;
    private String sessionId;
    private String toParticipantId;
    private String fromParticipant;
    private String categoryId;
}
