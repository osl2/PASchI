package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.PositionDto;
import edu.kit.informatik.model.userdata.rooms.Position;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionMapper implements IModelDtoMapper<Position, PositionDto> {

    @Override
    public PositionDto modelToDto(Position position) {
        return null;
    }

    @Override
    public List<PositionDto> modelToDto(List<Position> positions) {
        return null;
    }

    @Override
    public Position dtoToModel(PositionDto positionDto) {
        return null;
    }

    @Override
    public List<Position> dtoToModel(List<PositionDto> positionDtos) {
        return null;
    }
}
