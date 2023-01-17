package edu.kit.informatik.dto.interactions;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InteractionDto {

    private Long id;
    private Long userId;
    private String timeStamp;
    private Long sessionId;
    private Long toParticipantId;
    private Long fromParticipant;
    private Long categoryId;
}
