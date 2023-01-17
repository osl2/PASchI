package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.model.userdata.interactions.Category;

import java.util.List;

public class CategoryMapper implements IModelDtoMapper<Category, CategoryDto> {

    @Override
    public CategoryDto modelToDto(Category category) {
        return null;
    }

    @Override
    public List<CategoryDto> modelToDto(List<Category> categories) {
        return null;
    }

    @Override
    public Category dtoToModel(CategoryDto categoryDto) {
        return null;
    }

    @Override
    public List<Category> dtoToModel(List<CategoryDto> categoryDtos) {
        return null;
    }
}
