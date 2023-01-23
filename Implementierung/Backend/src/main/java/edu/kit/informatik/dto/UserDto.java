package edu.kit.informatik.dto;

import edu.kit.informatik.model.User;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data-Transfer-Object zur Klasse {@link User}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
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
