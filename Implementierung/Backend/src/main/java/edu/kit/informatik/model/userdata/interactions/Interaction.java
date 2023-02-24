package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.DataObject;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Session;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

/**
 * Entität einer Interaktion
 *
 * @author uqkai
 * @author ugqbo
 * @version 1.0
 */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "interactions")
public class Interaction extends DataObject {

    private String timeStamp;

    @ManyToOne
    private Session session;

    @ManyToOne
    private Participant from;

    @ManyToOne
    private Participant to;

    @ManyToOne
    private Category category;

    /**
     * @param id Id
     * @param user {@link User}
     * @param timeStamp Zeitstempel
     * @param session {@link Session Sitzung}
     * @param from {@link Participant From-Participant} von dem die Interaktion ausgeht
     * @param to {@link Participant To-Participant} zu dem die Interaktion geht
     * @param category {@link Category Kategorie}
     * @param createdAt {@link Timestamp} der Erstellung
     * @param updatedAt {@link Timestamp} der letzten Änderung
     */
    public Interaction(String id, User user, String timeStamp, Session session, Participant from, Participant to,
                       Category category, Timestamp createdAt, Timestamp updatedAt) {
        super(id, user, createdAt, updatedAt);
        this.timeStamp = timeStamp;
        this.session = session;
        this.from = from;
        this.to = to;
        this.category = category;
    }
}
