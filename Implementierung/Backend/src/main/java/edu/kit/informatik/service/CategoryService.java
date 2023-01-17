package edu.kit.informatik.service;

import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service für {@link Category Kategorien}
 *
 * @author ugqbo
 * @version 0.1
 */

@Service
public class CategoryService implements BaseService<Category, CategoryDto> {

    private final CategoryBaseRepository categoryBaseRepository;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param categoryBaseRepository {@link CategoryBaseRepository}
     */
    public CategoryService(CategoryBaseRepository categoryBaseRepository) {
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
    public CategoryDto getById(long id) {
        return null;
    }

    @Override
    public List<CategoryDto> getAll() {
        return null;
    }

    @Override
    public long delete(long id) {
        return 0;
    }
}
