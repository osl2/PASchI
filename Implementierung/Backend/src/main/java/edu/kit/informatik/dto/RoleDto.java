package edu.kit.informatik.dto;

import edu.kit.informatik.model.Role;


/**
 * Data-Transfer-Object zum Enum {@link Role}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
public enum RoleDto {
    /**
     * Rolle für Administratoren
     */
    ADMIN("admin"),
    /**
     * Rolle für Benutzer
     */
    USER("user");

    RoleDto(String string) {
    }

    public static RoleDto getRoleDtoByString(String string) {
        for (RoleDto role: RoleDto.values()) {
            if (role.toString().toLowerCase().equals(string)) {
                return role;
            }
        }

        return null;
    }



}
