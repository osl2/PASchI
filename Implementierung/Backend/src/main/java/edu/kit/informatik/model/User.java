package edu.kit.informatik.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

/**
 * Benutzer zur Authentifizierung der Rest-Api
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@ToString
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User implements Comparable<User>, UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private boolean auth;
    private Role role;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    /**
     *
     * @param firstName Vorname
     * @param lastName Nachname
     * @param email Email
     * @param password Password
     * @param auth {@code true}, wenn Nutzer freigeschaltet ist
     * @param role {@link Role}
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public User(String firstName, String lastName, String email, String password,
                boolean auth, Role role, Timestamp createdAt, Timestamp updatedAt) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.auth = auth;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Setzen des Vornamens
     * @param firstName Vorname
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * Setzen des Nachnamens
     * @param lastName Nachname
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Setzen des Passwortes
     * @param password Passwort
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Setzen der Freigabe
     * @param auth {@code boolescher Wert}
     */
    public void setAuth(boolean auth) {
        this.auth = auth;
    }

    /**
     * Setzen der {@link Role}
     * @param role {@link Role}
     */
    public void setRole(Role role) {
        this.role = role;
    }

    /**
     * Setzen des {@link Timestamp} der Erstellung
     * @param createdAt {@link Timestamp} der Erstellung
     */
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Setzen des {@link Timestamp} der letzten Änderung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public int compareTo(User o) {
        UUID thisUser = UUID.fromString(this.id);
        UUID oUser = UUID.fromString(o.getId());

        return  thisUser.compareTo(oUser);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(this.getRole().toString()));
        return authorities;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return  auth;
    }

    @Override
    public boolean isAccountNonLocked() {
        return auth;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return auth;
    }
}
