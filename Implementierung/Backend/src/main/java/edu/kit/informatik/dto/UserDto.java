package edu.kit.informatik.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDto {

    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private boolean auth;
    private String token;
    private RoleDto role;
}
