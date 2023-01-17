package edu.kit.informatik.dto.userdata.interactions;

import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
public class TeacherDto extends ParticipantDto {

    public TeacherDto(Long id, Long userId, String firstName, String lastName, List<Long> courseIds,
                      List<Long> interactionsIds) {
        super(id, userId, firstName, lastName, courseIds, interactionsIds);
    }
}
