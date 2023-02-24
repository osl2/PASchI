package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.PositionDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.rooms.Position;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * {@link IModelDtoMapper} für {@link Position} and {@link PositionDto}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Service
public class PositionMapper implements IModelDtoMapper<Position, PositionDto> {

    private final UserRepository userRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param userRepository     {@link UserRepository}
     */
    @Autowired
    public PositionMapper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public PositionDto modelToDto(Position position) {
        return new PositionDto(
                position.getId(),
                position.getUser().getId(),
                position.getXCoordinate(),
                position.getYCoordinate(),
                position.getOrientation(),
                position.getCreatedAt(),
                position.getUpdatedAt()
        );
    }

    @Override
    public List<PositionDto> modelToDto(List<Position> positions) {
        List<PositionDto> positionDtos = new ArrayList<>();
        positions.forEach(position -> positionDtos.add(modelToDto(position)));

        return positionDtos;
    }

    @Override
    public Position dtoToModel(PositionDto positionDto) {
        User user = userRepository.findUserById(positionDto.getUserId()).orElse(null);

        Timestamp updatedAt;

        if (positionDto.getUpdatedAt() == null) {
            updatedAt = positionDto.getCreatedAt();
        } else {
            updatedAt = positionDto.getUpdatedAt();
        }

        return new Position(positionDto.getXCoordinate(), positionDto.getYCoordinate(),
                                positionDto.getOrientation(), user, positionDto.getCreatedAt(), updatedAt);
    }

    @Override
    public List<Position> dtoToModel(List<PositionDto> positionDtos) {
        List<Position> positions = new ArrayList<>();
        positionDtos.forEach(positionDto -> positions.add(dtoToModel(positionDto)));

        return positions;
    }
}
