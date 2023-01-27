package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.QualityDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Quality;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RatedCategoryMapper implements IModelDtoMapper<RatedCategory, RatedCategoryDto, RatedCategoryDto> {

    private final CategoryBaseRepository<RatedCategory, String> categoryRepository;
    private final QualityMapper qualityMapper;
    private final UserRepository userRepository;

    @Autowired
    public RatedCategoryMapper(CategoryBaseRepository<RatedCategory, String> categoryRepository, QualityMapper qualityMapper,
                               UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.qualityMapper = qualityMapper;
        this.userRepository = userRepository;
    }

    @Override
    public RatedCategoryDto modelToDto(RatedCategory category) {
        QualityDto qualityDto = qualityMapper.modelToDto(category.getQuality());

        return new RatedCategoryDto(
                category.getId(),
                category.getUser().getId(),
                category.getName(),
                qualityDto
        );
    }

    @Override
    public List<RatedCategoryDto> modelToDto(List<RatedCategory> categories) {
        List<RatedCategoryDto> ratedCategoryDtos = new ArrayList<>();
        categories.forEach(category -> ratedCategoryDtos.add(modelToDto(category)));

        return ratedCategoryDtos;
    }

    @Override
    public RatedCategory dtoToModel(RatedCategoryDto categoryDto) {
        RatedCategory category = categoryRepository.findCategoryById(categoryDto.getId()).orElseGet(RatedCategory::new);
        User user = userRepository.findUserById(categoryDto.getUserId()).orElse(null);
        Quality quality = qualityMapper.dtoToModel(categoryDto.getQuality());

        category.setUser(user);
        category.setName(categoryDto.getName());
        category.setQuality(quality);

        return category;
    }

    @Override
    public List<RatedCategory> dtoToModel(List<RatedCategoryDto> categoryDtos) {
        List<RatedCategory> ratedCategories = new ArrayList<>();
        categoryDtos.forEach(categoryDto -> ratedCategories.add(dtoToModel(categoryDto)));

        return ratedCategories;
    }
}
