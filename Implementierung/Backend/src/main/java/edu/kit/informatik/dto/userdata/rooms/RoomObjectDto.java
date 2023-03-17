package edu.kit.informatik.dto.userdata.rooms;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import edu.kit.informatik.model.userdata.rooms.RoomObject;
import edu.kit.informatik.model.userdata.rooms.Table;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;

/**
 * Data-Transfer-Object zur Klasse {@link RoomObject}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@JsonTypeInfo( use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = ChairDto.class, name = "chair"),
    @JsonSubTypes.Type(value = TableDto.class, name = "table")
})
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
