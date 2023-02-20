package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.ChairDto;
import edu.kit.informatik.dto.userdata.rooms.PositionDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.rooms.Chair;
import edu.kit.informatik.model.userdata.rooms.Position;
import edu.kit.informatik.repositories.ChairRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * {@link IModelDtoMapper} für {@link Chair} and {@link ChairDto}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Service
public class ChairMapper implements IModelDtoMapper<Chair, ChairDto> {

    private final UserRepository userRepository;
    private final ChairRepository chairRepository;
    private final PositionMapper positionMapper;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param userRepository  {@link UserRepository}
     * @param chairRepository {@link ChairRepository}
     * @param positionMapper  {@link PositionMapper}
     */
    @Autowired
    public ChairMapper(UserRepository userRepository, ChairRepository chairRepository, PositionMapper positionMapper) {
        this.userRepository = userRepository;
        this.chairRepository = chairRepository;
        this.positionMapper = positionMapper;
    }

    @Override
    public ChairDto modelToDto(Chair chair) {
        PositionDto positionDto = positionMapper.modelToDto(chair.getPosition());

        return new ChairDto(chair.getId(), chair.getUser().getId(), positionDto,
                            chair.getCreatedAt(), chair.getUpdatedAt());
    }

    @Override
    public List<ChairDto> modelToDto(List<Chair> chairs) {
        List<ChairDto> chairDtos = new ArrayList<>();
        chairs.forEach(chair -> chairDtos.add(modelToDto(chair)));

        return chairDtos;
    }

    @Override
    public Chair dtoToModel(ChairDto chairDto) {
        User user = userRepository.findUserById(chairDto.getUserId()).orElse(null);
        Position position = positionMapper.dtoToModel(chairDto.getPosition());

        Timestamp updatedAt;

        if (chairDto.getUpdatedAt() == null) {
            updatedAt = chairDto.getCreatedAt();
        } else {
            updatedAt = chairDto.getUpdatedAt();
        }

        Chair chair =  new Chair(user, position, chairDto.getCreatedAt(), updatedAt);

        return chairRepository.save(chair);
    }

    @Override
    public List<Chair> dtoToModel(List<ChairDto> chairDtos) {
        List<Chair> chairs = new ArrayList<>();
        chairDtos.forEach(chairDto -> chairs.add(dtoToModel(chairDto)));

        return chairs;
    }
}
