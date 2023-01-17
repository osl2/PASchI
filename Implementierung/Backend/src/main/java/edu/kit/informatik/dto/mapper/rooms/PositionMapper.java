package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.PositionDto;
import edu.kit.informatik.model.userdata.rooms.Position;
import edu.kit.informatik.repositories.PositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class PositionMapper implements IModelDtoMapper<Position, PositionDto> {

    private final PositionRepository positionRepository;

    @Autowired
    public PositionMapper(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    @Override
    public PositionDto modelToDto(Position position) {
        return new PositionDto(
                position.getId(),
                position.getUser().getId(),
                position.getXCoordinate(),
                position.getYCoordinate(),
                position.getOrientation()
        );
    }

    @Override
    public List<PositionDto> modelToDto(List<Position> positions) {
        List<PositionDto> positionDtos = new LinkedList<>();
        positions.forEach(position -> positionDtos.add(modelToDto(position)));

        return positionDtos;
    }

    @Override
    public Position dtoToModel(PositionDto positionDto) {
        // repository fehlt noch
        return null;
    }

    @Override
    public List<Position> dtoToModel(List<PositionDto> positionDtos) {
        List<Position> positions = new LinkedList<>();
        positionDtos.forEach(positionDto -> positions.add(dtoToModel(positionDto)));

        return positions;
    }
}
