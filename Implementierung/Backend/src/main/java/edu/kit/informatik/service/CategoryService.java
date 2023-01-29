package edu.kit.informatik.service;


import edu.kit.informatik.dto.mapper.interactions.CategoryMapper;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

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
        //System.out.println(categoryDto.getId());
        Category newCategory = this.categoryBaseRepository.save(this.mapper.dtoToModel(categoryDto));
        //this.mapper.dtoToModel(categoryDto);
        //this.categoryBaseRepository.save(new Category());
        return this.mapper.modelToDto(newCategory);
    }

    @Transactional
    @Override
    public CategoryDto update(RatedCategoryDto categoryDto) {
        Optional<Category> repositoryCategoryOptional = this.categoryBaseRepository
                                                                .findCategoryById(categoryDto.getId());

        if (repositoryCategoryOptional.isEmpty()) {
            return null;
        }

        Category repositoryCategory = repositoryCategoryOptional.get();
        Category newCategory = this.mapper.dtoToModel(categoryDto);

        if (!newCategory.getName().equals(repositoryCategory.getName())) {
            repositoryCategory.setName(newCategory.getName());
        } else {
            if (repositoryCategory instanceof RatedCategory ratedRepositoryCategory
                    && newCategory instanceof  RatedCategory ratedNewCategory) {
                ratedRepositoryCategory.setQuality(ratedNewCategory.getQuality());
            }
        }

        return categoryDto;
    }

    @Override
    public CategoryDto getById(String id) {
        Optional<Category> categoryOptional = this.categoryBaseRepository.findCategoryById(id);

        return categoryOptional.map(this.mapper::modelToDto).orElse(null);
    }

    @Override
    public List<CategoryDto> getAll() {
        return this.mapper.modelToDto(this.categoryBaseRepository.findAll());
    }

    @Override
    public String delete(String id) {
        this.categoryBaseRepository.deleteById(id);
        return id;
    }
}
