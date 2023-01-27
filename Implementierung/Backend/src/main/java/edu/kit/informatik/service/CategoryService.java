package edu.kit.informatik.service;


import edu.kit.informatik.dto.mapper.interactions.CategoryMapper;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

/**
 * Service für {@link Category Kategorien}
 *
 * @author ugqbo
 * @version 0.1
 */

@Component
@EnableAutoConfiguration
public class CategoryService extends BaseService<Category, RatedCategoryDto, CategoryDto> {

    private final CategoryBaseRepository<Category, String> categoryBaseRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param categoryBaseRepository {@link CategoryBaseRepository}
     * @param categoryMapper {@link CategoryMapper}
     */
    public CategoryService(CategoryBaseRepository<Category, String> categoryBaseRepository,
                           CategoryMapper categoryMapper) {
        super(categoryMapper);
        this.categoryBaseRepository = categoryBaseRepository;
    }

    @Override
    public CategoryDto add(@RequestBody RatedCategoryDto categoryDto) {
        System.out.println(categoryDto.getId());
        Category newCategory = (Category) this.categoryBaseRepository.save(this.mapper.dtoToModel(categoryDto));
        return this.mapper.modelToDto(newCategory);
    }

    @Override
    public CategoryDto update(RatedCategoryDto categoryDto) {
        return null;
    }

    @Override
    public CategoryDto getById(String id) {
        return null;
    }

    @Override
    public List<CategoryDto> getAll() {
        return null;
    }

    @Override
    public String delete(String id) {
        return null;
    }
}
