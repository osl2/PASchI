package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.QualityDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Quality;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.repositories.RatedCategoryRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class RatedCategoryMapper implements IModelDtoMapper<RatedCategory, RatedCategoryDto> {

    private final RatedCategoryRepository categoryRepository;
    private final QualityMapper qualityMapper;
    private final UserRepository userRepository;

    @Autowired
    public RatedCategoryMapper(RatedCategoryRepository categoryRepository, QualityMapper qualityMapper,
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
        List<RatedCategoryDto> ratedCategoryDtos = new LinkedList<>();
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
        List<RatedCategory> ratedCategories = new LinkedList<>();
        categoryDtos.forEach(categoryDto -> ratedCategories.add(dtoToModel(categoryDto)));

        return ratedCategories;
    }
}
