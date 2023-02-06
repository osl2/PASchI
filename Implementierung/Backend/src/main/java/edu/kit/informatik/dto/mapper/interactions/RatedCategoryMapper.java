package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.QualityDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Quality;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * {@link IModelDtoMapper} für {@link Session} and {@link SessionDto}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@Service
public class RatedCategoryMapper implements IModelDtoMapper<RatedCategory, RatedCategoryDto> {

    private final QualityMapper qualityMapper;
    private final UserRepository userRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param qualityMapper {@link QualityMapper}
     * @param userRepository {@link UserRepository}
     */
    @Autowired
    public RatedCategoryMapper(QualityMapper qualityMapper,
                               UserRepository userRepository) {
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

        User user = userRepository.findUserById(categoryDto.getUserId()).orElse(null);
        Quality quality = qualityMapper.dtoToModel(categoryDto.getQuality());

        return new RatedCategory(user, categoryDto.getName(), quality);
    }

    @Override
    public List<RatedCategory> dtoToModel(List<RatedCategoryDto> categoryDtos) {
        List<RatedCategory> ratedCategories = new ArrayList<>();
        categoryDtos.forEach(categoryDto -> ratedCategories.add(dtoToModel(categoryDto)));

        return ratedCategories;
    }
}
