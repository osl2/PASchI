package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * Entität einer Kategorie mit Qualität. Erbt von {@link Quality}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
public class RatedCategory extends Category {

    @Enumerated(EnumType.STRING)
    private Quality quality;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param user {@link User}
     * @param name Name
     * @param quality {@link Quality}
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public RatedCategory(User user, String name, Quality quality, Timestamp createdAt, Timestamp updatedAt) {
        super(user, name, createdAt, updatedAt);
        this.quality = quality;
    }
}
