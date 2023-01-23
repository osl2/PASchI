package edu.kit.informatik.dto.userdata.interactions;

import edu.kit.informatik.model.userdata.interactions.ParticipantType;

/**
 * Data-Transfer-Object zum Enum {@link ParticipantType}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
public enum ParticipantTypeDto {

    /**
     * Teilnehmertyp für Studenten
     */
    Student("student"),
    /**
     * Teilnehmertyp für Lehrer
     */
    Teacher("teacher");

    ParticipantTypeDto(String string) {
    }

    @Override
    public String toString() {
        return this.name();
    }

    public static ParticipantTypeDto getQualityByString(String string) {
        for (ParticipantTypeDto participantType: ParticipantTypeDto.values()) {
            if (participantType.toString().toLowerCase().equals(string)) {
                return participantType;
            }
        }

        return null;
    }
}
