package edu.kit.informatik.dto.mapper.interactions;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.repositories.CategoryBaseRepository;

import java.util.LinkedList;
import java.util.List;

public class CategoryMapper implements IModelDtoMapper<Category, CategoryDto> {

    private final CategoryBaseRepository categoryRepository;

    public CategoryMapper(CategoryBaseRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryDto modelToDto(Category category) {
        return new CategoryDto(category.getId(), category.getUser().getId(), category.getName());
    }

    @Override
    public List<CategoryDto> modelToDto(List<Category> categories) {
        List<CategoryDto> categoryDtos = new LinkedList<>();
        categories.forEach(category -> categoryDtos.add(modelToDto(category)));

        return categoryDtos;
    }

    @Override
    public Category dtoToModel(CategoryDto categoryDto) {
        // repository fehlt noch
        return null;
    }

    @Override
    public List<Category> dtoToModel(List<CategoryDto> categoryDtos) {
        List<Category> categories = new LinkedList<>();
        categoryDtos.forEach(categoryDto -> categories.add(dtoToModel(categoryDto)));

        return categories;
    }
}
