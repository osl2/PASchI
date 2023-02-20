package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
public class Room extends DataObject {
    /*
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private User user;
     */

    private String name;

    @OneToMany
    @Cascade(CascadeType.ALL)
    private List<Table> tables;

    @OneToMany
    @Cascade(CascadeType.ALL)
    private  List<Chair> chairs;

    public Room(User user, String name, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        //this.user = user;
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
