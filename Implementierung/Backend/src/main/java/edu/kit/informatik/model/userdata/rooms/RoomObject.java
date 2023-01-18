package edu.kit.informatik.model.userdata.rooms;

import edu.kit.informatik.model.User;

/**
 * TODO: Problem: Roomobject wir din SeatArrangement als Entität geführt.
 *  Da wir aber RoomObject nicht selber speichern wollen, sondern nur die Unterklasse, wollen wir RommObyject nicht als Entität
 *  -> Lösungsvorschlag: Wir speichern Roomobjects und fügen ein Attribut Typ als Enum hinzu ->es wird leere Kästen in der Tabelle geben!
 */
public abstract class RoomObject {

    private Long id;

    private User user;
    private Position position;

    public RoomObject(User user, Position position) {
        this.user = user;
        this.position = position;
    }

    public RoomObject() {
    }

    public abstract boolean isTable();

    public User getUser() {
        return user;
    }

    public Position getPosition() {
        return position;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setPosition(Position position) {
        this.position = position;
    }
}
