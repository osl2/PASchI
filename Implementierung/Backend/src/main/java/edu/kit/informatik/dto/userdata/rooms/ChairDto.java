package edu.kit.informatik.dto.userdata.rooms;

public class ChairDto extends RoomObjectDto {

    public ChairDto(String id, String userId, PositionDto position) {
        super(id, userId, position);
    }

    @Override
    public boolean isTable() {
        return false;
    }
}
