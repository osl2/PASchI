package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * Entität einer Kateorie
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "categories")
public class Category extends DataObject {

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
