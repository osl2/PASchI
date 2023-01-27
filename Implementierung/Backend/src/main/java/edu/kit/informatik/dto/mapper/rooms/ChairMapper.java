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

import java.util.ArrayList;
import java.util.List;

@Service
public class ChairMapper implements IModelDtoMapper<Chair, ChairDto, ChairDto> {

    private final ChairRepository chairRepository;
    private final UserRepository userRepository;
    private final PositionMapper positionMapper;

    @Autowired
    public ChairMapper(ChairRepository chairRepository, UserRepository userRepository, PositionMapper positionMapper) {
        this.chairRepository = chairRepository;
        this.userRepository = userRepository;
        this.positionMapper = positionMapper;
    }

    @Override
    public ChairDto modelToDto(Chair chair) {
        PositionDto positionDto = positionMapper.modelToDto(chair.getPosition());

        return new ChairDto(chair.getId(), chair.getUser().getId(), positionDto);
    }

    @Override
    public List<ChairDto> modelToDto(List<Chair> chairs) {
        List<ChairDto> chairDtos = new ArrayList<>();
        chairs.forEach(chair -> chairDtos.add(modelToDto(chair)));

        return chairDtos;
    }

    @Override
    public Chair dtoToModel(ChairDto chairDto) {
        Chair chair = chairRepository.findChairById(chairDto.getId()).orElseGet(Chair::new);
        User user = userRepository.findUserById(chairDto.getUserId()).orElse(null);
        Position position = positionMapper.dtoToModel(chairDto.getPosition());

        chair.setUser(user);
        chair.setPosition(position);

        return chair;
    }

    @Override
    public List<Chair> dtoToModel(List<ChairDto> chairDtos) {
        List<Chair> chairs = new ArrayList<>();
        chairDtos.forEach(chairDto -> chairs.add(dtoToModel(chairDto)));

        return chairs;
    }
}
