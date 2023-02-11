package edu.kit.informatik.dto.userdata.rooms;

import edu.kit.informatik.model.userdata.rooms.RoomObject;
import edu.kit.informatik.model.userdata.rooms.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * Data-Transfer-Object zur Klasse {@link RoomObject}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public abstract class RoomObjectDto {

    private String id;
    private String userId;
    private PositionDto position;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    /**
     * Abstrakte Methode zur Vererbung zur Implementierung in Unterklassen
     * @return {@code true}, wenn {@link RoomObject} ein {@link Table} ist
     */
    public abstract boolean isTable();
}
