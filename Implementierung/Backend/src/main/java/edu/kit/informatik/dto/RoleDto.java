package edu.kit.informatik.dto;


public enum RoleDto {
    ADMIN("admin"),
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
