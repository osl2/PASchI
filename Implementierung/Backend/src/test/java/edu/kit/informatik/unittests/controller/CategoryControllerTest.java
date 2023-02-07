package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.dto.mapper.courses.CourseMapper;
import edu.kit.informatik.dto.mapper.interactions.CategoryMapper;
import edu.kit.informatik.dto.mapper.interactions.RatedCategoryMapper;
import edu.kit.informatik.dto.mapper.rooms.RoomMapper;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.QualityDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.RoomRepository;
import edu.kit.informatik.repositories.UserRepository;
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
    private CategoryMapper categoryMapper;

    @Autowired
    private RatedCategoryMapper ratedCategoryMapper;

    @Autowired
    private CategoryBaseRepository<RatedCategory, String> categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMapper roomMapper;


    private List<RatedCategoryDto> categories;

    @Before
    @Override
    public void setUp() {
        super.setUp();
        this.categories = addSomeCategories();
    }

    @After
    @Override
    public void setDown() {
        this.userRepository.deleteAll();
        this.categoryRepository.deleteAll();
    }

    private List<RatedCategoryDto> addSomeCategories() {

        List<RatedCategoryDto> categoryDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            categoryDtos.add(getNewCategory(faker));
        }

        return categoryDtos;

    }

    private void deleteFromDataBase() {

        for (RatedCategoryDto categoryDto: categories) {
            if (categoryDto.getId() != null) {
                this.categoryRepository.deleteById(categoryDto.getId());
            }
        }

        categories.clear();
    }

    private void addCategoryToDatabase() throws Exception {

        List<RatedCategoryDto> repositoryCategory = new ArrayList<>();
        for (RatedCategoryDto categoryDto: this.categories) {
            RatedCategory category = ratedCategoryMapper.dtoToModel(categoryDto);

            repositoryCategory.add(ratedCategoryMapper.modelToDto(this.categoryRepository.save(category)));
        }

        assertEquals(categories.size(), repositoryCategory.size());
        for (int i = 0; i< categories.size(); i++) {
            assertEquals(categories.get(i).getUserId(), repositoryCategory.get(i).getUserId());
            assertEquals(categories.get(i).getName(), repositoryCategory.get(i).getName());
            assertNotNull(repositoryCategory.get(i).getId());
        }

        this.categories = repositoryCategory;


        //addCategories();
    }

    @Test
    public void addCategories() throws Exception {
        for (RatedCategoryDto categoryDto: categories) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                            .content(super.mapToJson(categoryDto))
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
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
        deleteFromDataBase();
    }


    @Test
    public void getOneCategory() throws Exception {
        addCategoryToDatabase();

        for (RatedCategoryDto categoryDto: categories) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + categoryDto.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            RatedCategoryDto categoryDtoFromDatabase = super.mapFromJson(content, RatedCategoryDto.class);


            assertEquals(categoryDto, categoryDtoFromDatabase);
        }

        deleteFromDataBase();
    }

    @Test
    public void getAllCategories() throws Exception {
        addCategoryToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                //.accept(MediaType.APPLICATION_JSON_VALUE)
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

        deleteFromDataBase();
    }

    @Test
    public void deleteCategories() throws Exception {
        List<CategoryDto> before = getCategoriesFromDataBase();
        addCategoryToDatabase();

        for (CategoryDto categoryDto: categories) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(categoryDto.getId()).param("id", categoryDto.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<CategoryDto> after = getCategoriesFromDataBase();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    private List<CategoryDto> getCategoriesFromDataBase() {

        List<RatedCategory> categoryList = categoryRepository.findAll();
        List<CategoryDto> categoryDtoList = new ArrayList<>();

        for (RatedCategory ratedCategory: categoryList) {
            categoryDtoList.add(categoryMapper.modelToDto(ratedCategory));
        }

        return categoryDtoList;
    }


    private RatedCategoryDto getNewCategory(Faker faker) {

        RatedCategoryDto categoryDto = new RatedCategoryDto();

        String name = faker.team().name();

        categoryDto.setName(name + " " + faker.number().randomDigit());

        User user = userRepository.save(userMapper.dtoToModel(getNewUser(faker)));
        categoryDto.setUserId(user.getId());
        categoryDto.setQuality(QualityDto.FIVE_STAR);

        return categoryDto;
    }

    private UserDto getNewUser(Faker faker) {
        UserDto userDto = new UserDto();
        userDto.setRole(RoleDto.USER);

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();

        userDto.setEmail(firstName + "." + lastName +  "@kit.edu");
        userDto.setFirstName(firstName);
        userDto.setLastName(lastName);
        userDto.setPassword(faker.crypto().md5());

        return userDto;
    }
}
