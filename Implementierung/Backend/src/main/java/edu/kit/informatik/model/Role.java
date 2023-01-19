package edu.kit.informatik.model;

import edu.kit.informatik.model.userdata.interactions.ParticipantType;

/**
 * Enum zur Implementierung verschiedener Rollen
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
public enum Role {
    ADMIN("admin"),
    USER("user");

    Role(String string) {
    }

    public static Role getRoleByString(String string) {
        for (Role role: Role.values()) {
            if (role.toString().toLowerCase().equals(string)) {
                return role;
            }
        }

        return null;
    }
}
