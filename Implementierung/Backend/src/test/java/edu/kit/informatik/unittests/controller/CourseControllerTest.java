package edu.kit.informatik.unittests.controller;


import com.github.javafaker.Faker;
import edu.kit.informatik.dto.mapper.courses.CourseMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.repositories.CourseRepository;
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


public class CourseControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/course";

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private CourseRepository courseRepository;

    private List<CourseDto> courses;

    @Before
    @Override
    public void setUp() {
        super.setUp();
        this.courses = addSomeCourses();
    }

    private List<CourseDto> addSomeCourses() {

        List<CourseDto> courseDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            courseDtos.add(getNewCourse(faker));
        }

        return courseDtos;

    }

    private void deleteFromDataBase() {

        for (CourseDto courseDto: courses) {
            if (courseDto.getId() != null) {
                this.courseRepository.deleteById(courseDto.getId());
            }
        }

        courses.clear();
    }


    @Test
    public void addCourseToDatabase() throws Exception {
        for (CourseDto courseDto: courses) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                            .content(super.mapToJson(courseDto))
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            CourseDto courseDtoFromContent = super.mapFromJson(content, CourseDto.class);

            assertEquals(courseDto.getName(), courseDtoFromContent.getName());
            assertEquals(courseDto.getSubject(), courseDtoFromContent.getSubject());
            assertNotNull(courseDtoFromContent.getId());
            courses.set(courses.indexOf(courseDto), courseDtoFromContent);
        }
        deleteFromDataBase();
    }


    @Test
    public void getOneCourse() throws Exception {
        addCourseToDatabase();

        for (CourseDto courseDto: courses) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + courseDto.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            CourseDto courseDtoFromDatabase = super.mapFromJson(content, CourseDto.class);


            assertEquals(courseDto, courseDtoFromDatabase);
        }

        deleteFromDataBase();
    }

    @Test
    public void getAllCourse() throws Exception {
        addCourseToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                //.accept(MediaType.APPLICATION_JSON_VALUE)
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        List<CourseDto> courseDtos = Arrays.asList(super.mapFromJson(content, CourseDto[].class));

        courseDtos.sort(Comparator.naturalOrder());
        courses.sort(Comparator.naturalOrder());


        for (int i= 0; i < courses.size(); i++) {
            assertEquals(courses.get(i), courseDtos.get(i));
        }

        deleteFromDataBase();
    }


    private CourseDto getNewCourse(Faker faker) {

        CourseDto courseDto = new CourseDto();

        String name = faker.team().name();

        courseDto.setName(name + " " + faker.number().randomDigit());
        courseDto.setSubject(name);
        courseDto.setUserId("4ccc614c-fda8-471d-b444-c70ca756cf0b");

        return courseDto;
    }
}
