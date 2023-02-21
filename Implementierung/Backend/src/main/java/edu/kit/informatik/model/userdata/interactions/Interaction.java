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

    public Interaction(User user, String timeStamp, Session session, Participant from, Participant to,
                       Category category, Timestamp createdAt, Timestamp updatedAt) {
        super(user, createdAt, updatedAt);
        //this.user = user;
        this.timeStamp = timeStamp;
        this.session = session;
        this.from = from;
        this.to = to;
        this.category = category;
    }
}
