package edu.kit.informatik.controller;

import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.userdata.interactions.Category;
import edu.kit.informatik.service.CategoryService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller für {@link Category Kategorien}
 *
 * @author ugqbo
 * @version 1.0
 */
@RestController
@RequestMapping(path = "/api/category")
public class CategoryController extends BaseController<Category, RatedCategoryDto, CategoryDto> {

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param categoryService {@link CategoryService}
     */
    public CategoryController(CategoryService categoryService) {
        super(categoryService);
    }

    @Override
    @PostMapping
    public CategoryDto add(@RequestBody RatedCategoryDto categoryDto, Authentication authentication) {
        return super.add(categoryDto, authentication);
    }

    @Override
    @PutMapping
    public CategoryDto update(@RequestBody RatedCategoryDto categoryDto, Authentication authentication) {
        return super.update(categoryDto, authentication);
    }

    @Override
    @GetMapping(path = "/{id}")
    public CategoryDto getById(@PathVariable("id") String id, Authentication authentication) {
        return super.getById(id, authentication);
    }

    @Override
    @GetMapping
    public List<CategoryDto> getAll(Authentication authentication) {
        return super.getAll(authentication);
    }

    @Override
    @DeleteMapping
    public String delete(@RequestParam String id, Authentication authentication) {
        return super.delete(id, authentication);
    }
}
