package edu.kit.informatik.service;


import edu.kit.informatik.dto.mapper.interactions.CategoryMapper;
import edu.kit.informatik.dto.mapper.interactions.RatedCategoryMapper;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.exceptions.EntityNotFoundException;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

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

    private static final String ID_ATTRIBUTE = "userId";

    private final CategoryBaseRepository<Category> categoryBaseRepository;
    private final RatedCategoryMapper ratedCategoryMapper;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     *
     * @param categoryBaseRepository {@link CategoryBaseRepository}
     * @param categoryMapper         {@link CategoryMapper}
     * @param ratedCategoryMapper    {@link RatedCategoryMapper}
     */
    public CategoryService(CategoryBaseRepository<Category> categoryBaseRepository,
                           CategoryMapper categoryMapper, RatedCategoryMapper ratedCategoryMapper) {
        super(categoryMapper);
        this.categoryBaseRepository = categoryBaseRepository;
        this.ratedCategoryMapper = ratedCategoryMapper;
    }

    @Override
    public CategoryDto add(RatedCategoryDto categoryDto, Authentication authentication) {
        super.checkAuthorization(authentication, categoryDto.getUserId());
        if (categoryDto.getQuality() == null) {
            Category newCategory = this.categoryBaseRepository.save(this.mapper.dtoToModel(categoryDto));
            return this.mapper.modelToDto(newCategory);
        } else {
            RatedCategory newCategory = this.categoryBaseRepository.save(
                                                this.ratedCategoryMapper.dtoToModel(categoryDto));
            return this.ratedCategoryMapper.modelToDto(newCategory);
        }

    }

    @Transactional
    @Override
    public CategoryDto update(RatedCategoryDto categoryDto, Authentication authentication) {
        super.checkAuthorization(authentication, categoryDto.getUserId());
        Optional<Category> repositoryCategoryOptional = this.categoryBaseRepository
                                                                .findCategoryById(categoryDto.getId());

        Category repositoryCategory = repositoryCategoryOptional.orElseThrow(() ->
                                                    new EntityNotFoundException(Category.class, categoryDto.getId()));
        Category newCategory = this.mapper.dtoToModel(categoryDto);

        if (!newCategory.getName().equals(repositoryCategory.getName())) {
            repositoryCategory.setName(newCategory.getName());
        }

        return mapper.modelToDto(repositoryCategory);
    }

    @Override
    public CategoryDto getById(String id, Authentication authentication) {
        Optional<Category> categoryOptional = this.categoryBaseRepository.findCategoryById(id);
        Category category = categoryOptional.orElseThrow(() -> new EntityNotFoundException(Category.class, id));
        super.checkAuthorization(authentication, category.getUser().getId());

        return this.mapper.modelToDto(category);
    }

    @Override
    public List<CategoryDto> getAll(Authentication authentication) {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        return this.mapper.modelToDto(this.categoryBaseRepository.findCategoryByUserId(
                                                                jAT.getTokenAttributes().get(ID_ATTRIBUTE).toString()));
    }

    @Override
    public String delete(String id, Authentication authentication) {
        Optional<Category> categoryOptional = this.categoryBaseRepository.findCategoryById(id);
        Category category = categoryOptional.orElseThrow(() -> new EntityNotFoundException(Category.class, id));
        super.checkAuthorization(authentication, category.getUser().getId());

        return delete(category);
    }

    /**
     * Methode zum Löschen einer Category
     * --> dient für andere Services
     * @param category {@link Category}
     * @return Id der {@link Category}
     */
    protected String delete(Category category) {
        this.categoryBaseRepository.deleteById(category.getId());
        return category.getId();
    }
}
