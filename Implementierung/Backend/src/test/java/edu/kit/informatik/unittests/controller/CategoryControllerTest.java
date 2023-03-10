package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.unittests.DatabaseManipulator;
import edu.kit.informatik.unittests.EntityGenerator;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class CategoryControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/category";


    @Autowired
    private DatabaseManipulator databaseManipulator;

    private List<RatedCategoryDto> categories;

    private UserDto userDto;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        userDto = super.addAndLogin(EntityGenerator.createNewUser(new Faker(new Locale("de"))));
        this.categories = addSomeCategories();
    }

    @After
    @Override
    public void setDown() {
        databaseManipulator.clearCategoryRepository();
        databaseManipulator.clearUserRepository();
        categories.clear();
    }

    private List<RatedCategoryDto> addSomeCategories() {

        List<RatedCategoryDto> categoryDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            categoryDtos.add(EntityGenerator.createNewCategory(faker, userDto));
        }

        return categoryDtos;

    }

    private void addCategoryToDatabase() {
        List<RatedCategoryDto> repositoryCategory = new ArrayList<>();
        for (RatedCategoryDto categoryDto: this.categories) {
            repositoryCategory.add(databaseManipulator.addCategory(categoryDto));
        }

        this.categories = repositoryCategory;
    }

    @Test
    public void addCategories() throws Exception {
        for (RatedCategoryDto categoryDto: categories) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                            .content(super.mapToJson(categoryDto))
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            RatedCategoryDto categoryDtoFromContent = super.mapFromJson(content, RatedCategoryDto.class);

            assertEquals(categoryDto.getUserId(), categoryDtoFromContent.getUserId());
            assertEquals(categoryDto.getName(), categoryDtoFromContent.getName());
            assertNotNull(categoryDtoFromContent.getId());
            categories.set(categories.indexOf(categoryDto), categoryDtoFromContent);
        }
    }


    @Test
    public void getOneCategory() throws Exception {
        addCategoryToDatabase();

        for (RatedCategoryDto categoryDto: categories) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + categoryDto.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            RatedCategoryDto categoryDtoFromDatabase = super.mapFromJson(content, RatedCategoryDto.class);


            assertEquals(categoryDto, categoryDtoFromDatabase);
        }

    }

    @Test
    public void getAllCategories() throws Exception {
        addCategoryToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                .header("Authorization", "Bearer " + userDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        List<RatedCategoryDto> categoryDtos = Arrays.asList(super.mapFromJson(content, RatedCategoryDto[].class));

        categoryDtos.sort(Comparator.naturalOrder());
        categories.sort(Comparator.naturalOrder());


        for (int i = 0; i < categories.size(); i++) {
            assertEquals(categories.get(i), categoryDtos.get(i));
        }
    }

    @Test
    public void deleteCategories() throws Exception {
        List<CategoryDto> before = databaseManipulator.getCategories();
        addCategoryToDatabase();

        for (CategoryDto categoryDto: categories) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(categoryDto.getId())
                    .param("id", categoryDto.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<CategoryDto> after = databaseManipulator.getCategories();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

}
