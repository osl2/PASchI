package edu.kit.informatik.dto.mapper.rooms;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.rooms.ChairDto;
import edu.kit.informatik.model.userdata.rooms.Chair;

import java.util.List;

public class ChairMapper implements IModelDtoMapper<Chair, ChairDto> {

    @Override
    public ChairDto modelToDto(Chair chair) {
        return null;
    }

    @Override
    public List<ChairDto> modelToDto(List<Chair> chairs) {
        return null;
    }

    @Override
    public Chair dtoToModel(ChairDto chairDto) {
        return null;
    }

    @Override
    public List<Chair> dtoToModel(List<ChairDto> chairDtos) {
        return null;
    }
}
