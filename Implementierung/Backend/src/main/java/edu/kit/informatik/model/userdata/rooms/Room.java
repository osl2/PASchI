package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Entität eines Raumes
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Getter
@NoArgsConstructor
@Entity
public class Room extends DataObject {

    private String name;

    @OneToMany
    private List<Table> tables;

    @OneToMany
    private  List<Chair> chairs;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param user {@link User}
     * @param name Name
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public Room(User user, String name, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        this.name = name;
        this.tables = new ArrayList<>();
        this.chairs = new ArrayList<>();
    }

    /**
     * Setzten der {@link Table Tische}
     * @param tables {@link List} von {@link Table Tischen}
     */
    public void setTables(List<Table> tables) {
        this.tables = tables;
    }

    /**
     * Setzen des Namens
     * @param name Name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Setzten der {@link Chair Stühle}
     * @param chairs {@link List} von {@link Chair Stühle}
     */
    public void setChairs(List<Chair> chairs) {
        this.chairs = chairs;
    }

    /**
     * Hinzufügen eines {@link Table Tisches}
     * @param table {@link Table}
     */
    public void addTable(Table table) {
        this.tables.add(table);
    }

    /**
     * Hinzufügen eines {@link Chair Stuhls}
     * @param chair {@link Chair Stuhl}
     */
    public void addChair(Chair chair) {
        this.chairs.add(chair);
    }
}
