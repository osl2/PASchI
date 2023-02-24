package edu.kit.informatik.model.userdata.interactions;

/**
 * Typ des {@link Participant}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
public enum ParticipantType {
    /**
     * Typ für Schüler
     */
    Student("student"),
    /**
     * Typ für den Lehrer
     */
    Teacher("teacher");

    ParticipantType(String string) {
    }

    @Override
    public String toString() {
        return this.name();
    }
}
