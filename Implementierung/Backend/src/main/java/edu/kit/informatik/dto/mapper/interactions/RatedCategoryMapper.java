package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.QualityDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class RatedCategoryMapper implements IModelDtoMapper<RatedCategory, RatedCategoryDto> {

    private final CategoryBaseRepository categoryRepository;

    @Autowired
    public RatedCategoryMapper(CategoryBaseRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public RatedCategoryDto modelToDto(RatedCategory category) {
        QualityMapper qualityMapper = new QualityMapper();
        QualityDto qualityDto = qualityMapper.modelToDto(category.getQuality());

        return new RatedCategoryDto(category.getId(), category.getUser().getId(), category.getName(), qualityDto);
    }

    @Override
    public List<RatedCategoryDto> modelToDto(List<RatedCategory> categories) {
        List<RatedCategoryDto> ratedCategoryDtos = new LinkedList<>();
        categories.forEach(category -> ratedCategoryDtos.add(modelToDto(category)));

        return ratedCategoryDtos;
    }

    @Override
    public RatedCategory dtoToModel(RatedCategoryDto categoryDto) {
        // repository fehlt noch
        return null;
    }

    @Override
    public List<RatedCategory> dtoToModel(List<RatedCategoryDto> categoryDtos) {
        List<RatedCategory> ratedCategories = new LinkedList<>();
        categoryDtos.forEach(categoryDto -> ratedCategories.add(dtoToModel(categoryDto)));

        return ratedCategories;
    }
}
