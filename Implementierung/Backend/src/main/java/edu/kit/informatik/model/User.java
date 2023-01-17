package edu.kit.informatik.model;

public class User {
    
     // @author uekai

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private boolean auth;
    private Role role;

    public User(String firstName, String lastName, String email, String password, boolean auth, Role role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.auth = auth;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public boolean isAuth() {
        return auth;
    }

    public Role getRole() {
        return role;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setAuth(boolean auth) {
        this.auth = auth;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
