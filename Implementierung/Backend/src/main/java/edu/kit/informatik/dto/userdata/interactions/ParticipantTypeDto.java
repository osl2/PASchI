package edu.kit.informatik.dto.userdata.interactions;

public enum ParticipantTypeDto {

    Student("student"),
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
