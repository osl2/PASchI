package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.QualityDto;
import edu.kit.informatik.model.userdata.interactions.Quality;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class QualityMapper implements IModelDtoMapper<Quality, QualityDto> {

    @Override
    public QualityDto modelToDto(Quality quality) {
        return QualityDto.valueOf(quality.toString());
    }

    @Override
    public List<QualityDto> modelToDto(List<Quality> qualities) {
        List<QualityDto> qualityDtos = new LinkedList<>();
        qualities.forEach(quality -> qualityDtos.add(modelToDto(quality)));

        return qualityDtos;
    }

    @Override
    public Quality dtoToModel(QualityDto qualityDto) {
        return Quality.valueOf(qualityDto.toString());
    }

    @Override
    public List<Quality> dtoToModel(List<QualityDto> qualityDtos) {
        List<Quality> qualities = new LinkedList<>();
        qualityDtos.forEach(qualityDto -> qualities.add(dtoToModel(qualityDto)));

        return qualities;
    }
}
