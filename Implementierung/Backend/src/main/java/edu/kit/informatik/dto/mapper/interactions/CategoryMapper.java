package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryMapper implements IModelDtoMapper<Category, RatedCategoryDto, CategoryDto> {

    private final CategoryBaseRepository<Category, String> categoryRepository;
    private final UserRepository userRepository;
    private final QualityMapper qualityMapper;

    @Autowired
    public CategoryMapper(CategoryBaseRepository<Category, String> categoryRepository, UserRepository userRepository, QualityMapper qualityMapper) {
        this.categoryRepository = categoryRepository;
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
    public Category dtoToModel(RatedCategoryDto categoryDto) {
        Category category;

        if (categoryDto.getQuality() == null) {
            category = categoryRepository.findCategoryById(categoryDto.getId()).orElseGet(Category::new);
        } else {
            category = categoryRepository.findCategoryById(categoryDto.getId()).orElseGet(RatedCategory::new);
        }
        User user = userRepository.findUserById(categoryDto.getUserId()).orElse(null);

        category.setUser(user);
        category.setName(categoryDto.getName());

        return category;
    }

    @Override
    public List<Category> dtoToModel(List<RatedCategoryDto> categoryDtos) {
        List<Category> categories = new ArrayList<>();
        categoryDtos.forEach(categoryDto -> categories.add(dtoToModel(categoryDto)));

        return categories;
    }
}
