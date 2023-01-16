package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.User;

public class Category {

    private Long id;
    private User user;
    private String name;

    public Category(User user, String name) {
        this.user = user;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getName() {
        return name;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setName(String name) {
        this.name = name;
    }
}
