package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Session;
import edu.kit.informatik.model.userdata.interactions.Category;
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
public class CategoryMapper implements IModelDtoMapper<Category, CategoryDto> {

    private final UserRepository userRepository;
    private final QualityMapper qualityMapper;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param userRepository {@link UserRepository}
     * @param qualityMapper {@link QualityMapper}
     */
    @Autowired
    public CategoryMapper(UserRepository userRepository, QualityMapper qualityMapper) {
        this.userRepository = userRepository;
        this.qualityMapper = qualityMapper;
    }

    @Override
    public CategoryDto modelToDto(Category category) {
        if (category instanceof RatedCategory ratedCategory) {
            return new RatedCategoryDto(ratedCategory.getId(), ratedCategory.getUser().getId(),
                                    ratedCategory.getName(), this.qualityMapper.modelToDto(ratedCategory.getQuality()));
        } else {
            return new CategoryDto(category.getId(), category.getUser().getId(), category.getName());
        }
    }

    @Override
    public List<CategoryDto> modelToDto(List<Category> categories) {
        List<CategoryDto> categoryDtos = new ArrayList<>();
        categories.forEach(category -> categoryDtos.add(modelToDto(category)));

        return categoryDtos;
    }

    @Override
    public Category dtoToModel(CategoryDto categoryDto) {

        User user = userRepository.findUserById(categoryDto.getUserId()).orElse(null);
        Category category = new Category(user, categoryDto.getName());


        category.setUser(user);
        category.setName(categoryDto.getName());

        return category;
    }

    @Override
    public List<Category> dtoToModel(List<CategoryDto> categoryDtos) {
        List<Category> categories = new ArrayList<>();
        categoryDtos.forEach(categoryDto -> categories.add(dtoToModel(categoryDto)));

        return categories;
    }
}
