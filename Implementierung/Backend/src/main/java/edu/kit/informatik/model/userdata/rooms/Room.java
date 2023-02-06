package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

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

    public void setTables(List<Table> tables) {
        this.tables = tables;
    }

    public void setName(String name) {
        this.name = name;
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
