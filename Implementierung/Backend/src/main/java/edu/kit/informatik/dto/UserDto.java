package edu.kit.informatik.dto;

import edu.kit.informatik.model.User;


import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;
import java.util.UUID;

/**
 * Data-Transfer-Object zur Klasse {@link User}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDto implements Comparable<UserDto> {

    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private boolean auth;
    private String token;
    private RoleDto role;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    @Override
    public int compareTo(UserDto o) {
        UUID thisUser = UUID.fromString(this.id);
        UUID oUser = UUID.fromString(o.getId());

        return  thisUser.compareTo(oUser);
    }
}
