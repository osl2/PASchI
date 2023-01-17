package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;

import java.util.List;

public class RatedCategoryMapper implements IModelDtoMapper<RatedCategory, RatedCategoryDto> {

    @Override
    public RatedCategoryDto modelToDto(RatedCategory category) {
        return null;
    }

    @Override
    public List<RatedCategoryDto> modelToDto(List<RatedCategory> categories) {
        return null;
    }

    @Override
    public RatedCategory dtoToModel(RatedCategoryDto categoryDto) {
        return null;
    }

    @Override
    public List<RatedCategory> dtoToModel(List<RatedCategoryDto> categoryDtos) {
        return null;
    }
}
