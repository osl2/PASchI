package edu.kit.informatik.service;


import edu.kit.informatik.dto.mapper.interactions.CategoryMapper;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Service für {@link Category Kategorien}
 *
 * @author ugqbo
 * @version 0.1
 */

@Component
@EnableAutoConfiguration
public class CategoryService extends BaseService<Category, CategoryDto> {

    private final CategoryBaseRepository categoryBaseRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param categoryBaseRepository {@link CategoryBaseRepository}
     * @param categoryMapper {@link CategoryMapper}
     */
    public CategoryService(CategoryBaseRepository categoryBaseRepository,
                           CategoryMapper categoryMapper) {
        super(categoryMapper);
        this.categoryBaseRepository = categoryBaseRepository;
    }

    @Override
    public CategoryDto add(CategoryDto categoryDto) {
        return null;
    }

    @Override
    public CategoryDto update(CategoryDto categoryDto) {
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
