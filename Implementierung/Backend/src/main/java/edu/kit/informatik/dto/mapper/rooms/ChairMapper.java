package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.ChairDto;
import edu.kit.informatik.dto.userdata.rooms.PositionDto;
import edu.kit.informatik.model.userdata.rooms.Chair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class ChairMapper implements IModelDtoMapper<Chair, ChairDto> {

    private final PositionMapper positionMapper;

    @Autowired
    public ChairMapper(PositionMapper positionMapper) {
        this.positionMapper = positionMapper;
    }

    @Override
    public ChairDto modelToDto(Chair chair) {
        PositionDto positionDto = positionMapper.modelToDto(chair.getPosition());

        return new ChairDto(chair.getId(), chair.getUser().getId(), positionDto);
    }

    @Override
    public List<ChairDto> modelToDto(List<Chair> chairs) {
        List<ChairDto> chairDtos = new LinkedList<>();
        chairs.forEach(chair -> chairDtos.add(modelToDto(chair)));

        return chairDtos;
    }

    @Override
    public Chair dtoToModel(ChairDto chairDto) {
        // repository fehlt noch
        return null;
    }

    @Override
    public List<Chair> dtoToModel(List<ChairDto> chairDtos) {
        List<Chair> chairs = new LinkedList<>();
        chairDtos.forEach(chairDto -> chairs.add(dtoToModel(chairDto)));

        return chairs;
    }
}
