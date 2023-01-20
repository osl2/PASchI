package edu.kit.informatik.model.userdata.interactions;

public enum ParticipantType {

    Student("student"),
    Teacher("teacher");

    ParticipantType(String string) {
    }

    @Override
    public String toString() {
        return this.name();
    }

    public static ParticipantType getQualityByString(String string) {
        for (ParticipantType participantType: ParticipantType.values()) {
            if (participantType.toString().toLowerCase().equals(string)) {
                return participantType;
            }
        }

        return null;
    }
}
