package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
@Entity
public class Room {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private User user;
    private String name;

    @OneToMany
    private List<Table> tables;

    @OneToMany
    private  List<Chair> chairs;

    public Room(User user, String name) {
        this.user = user;
        this.name = name;
        this.tables = new ArrayList<>();
        this.chairs = new ArrayList<>();
    }

    public Room() {
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

    public List<Table> getTables() {
        return tables;
    }

    public void setTables(List<Table> tables) {
        this.tables = tables;
    }

    public List<Chair> getChairs() {
        return chairs;
    }

    public void setChairs(List<Chair> chairs) {
        this.chairs = chairs;
    }

    public void addTable(Table table) {
        this.tables.add(table);
    }

    public void addChair(Chair chair) {
        this.chairs.add(chair);
    }
}
