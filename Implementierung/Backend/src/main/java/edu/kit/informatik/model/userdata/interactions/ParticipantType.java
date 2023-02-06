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
}
