package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.userdata.interactions.QualityDto;
import edu.kit.informatik.model.userdata.interactions.Quality;

import java.util.List;

public class QualityMapper implements IModelDtoMapper<Quality, QualityDto> {

    @Override
    public QualityDto modelToDto(Quality quality) {
        return null;
    }

    @Override
    public List<QualityDto> modelToDto(List<Quality> qualities) {
        return null;
    }

    @Override
    public Quality dtoToModel(QualityDto qualityDto) {
        return null;
    }

    @Override
    public List<Quality> dtoToModel(List<QualityDto> qualityDtos) {
        return null;
    }
}
