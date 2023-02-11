package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.sql.Timestamp;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "categories")
public class Category extends DataObject {
    /*
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private User user;
     */

    private String name;

    public Category(User user, String name, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        //this.user = user;
        this.name = name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
