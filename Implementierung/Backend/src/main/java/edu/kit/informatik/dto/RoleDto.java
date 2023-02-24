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
    ADMIN(),
    /**
     * Rolle für Benutzer
     */
    USER();

    RoleDto() {
    }

    @Override
    public String toString() {
        return this.name();
    }
}
