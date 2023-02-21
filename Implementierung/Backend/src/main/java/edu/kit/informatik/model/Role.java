package edu.kit.informatik.model;


/**
 * Enum zur Implementierung verschiedener Rollen
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
public enum Role {

    /**
     * Typ für Admin
     */
    ADMIN("admin"),
    /**
     * Typ für User
     */
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
