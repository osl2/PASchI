package edu.kit.informatik.unittests.controller;


import com.github.javafaker.Faker;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
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


public class CourseControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/course";

    @Autowired
    DatabaseManipulator databaseManipulator;

    private List<CourseDto> courses;

    private UserDto userDto;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        userDto = super.addAndLogin(EntityGenerator.createNewUser(new Faker(new Locale("de"))));
        this.courses = addSomeCourses();
    }

    @After
    @Override
    public void setDown() {
        databaseManipulator.clearCourseRepository();
        databaseManipulator.clearParticipantRepository();
        databaseManipulator.clearUserRepository();
        this.courses.clear();
    }

    private List<CourseDto> addSomeCourses() {

        List<CourseDto> courseDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            courseDtos.add(EntityGenerator.createNewCourse(faker, userDto));
        }

        return courseDtos;

    }

    private void addCoursesToDatabase() {
        List<CourseDto> repositoryCourse = new ArrayList<>();
        for (CourseDto courseDto: this.courses) {
            repositoryCourse.add(databaseManipulator.addCourse(courseDto));
        }

        this.courses = repositoryCourse;
    }

    @Test
    public void addCourses() throws Exception{
        for (CourseDto courseDto: courses) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(courseDto))
                    .header("Authorization", "Bearer " + userDto.getToken())
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
    }


    @Test
    public void getOneCourse() throws Exception {
        addCoursesToDatabase();

        for (CourseDto courseDto: courses) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + courseDto.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            CourseDto courseDtoFromDatabase = super.mapFromJson(content, CourseDto.class);


            assertEquals(courseDto, courseDtoFromDatabase);
        }
    }

    @Test
    public void getAllCourse() throws Exception {
        addCoursesToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                .header("Authorization", "Bearer " + userDto.getToken())
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
    }

    @Test
    public void updateCourse() throws Exception {
        addCoursesToDatabase();

        List<CourseDto> courseDtos = addSomeCourses();

        for (int i = 0; i < courses.size(); i++) {
            courses.get(i).setName(courseDtos.get(i).getName());
            courses.get(i).setSubject(courseDtos.get(i).getSubject());
            //courses.get(i).setName(courseDtos.get(i).getName());
            //courses.get(i).setName(courseDtos.get(i).getName());
        }

        for (CourseDto courseDto: courses) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(courseDto))
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }

        List<CourseDto> courseDtosFromDB = databaseManipulator.getCourses();

        courseDtosFromDB.sort(Comparator.naturalOrder());
        courses.sort(Comparator.naturalOrder());

        assertEquals(courseDtosFromDB.size(), courses.size());

        for (int i = 0; i < courses.size(); i++) {
            assertEquals(courseDtosFromDB.get(i).getName(), courses.get(i).getName());
            assertEquals(courseDtosFromDB.get(i).getCreatedAt(), courses.get(i).getCreatedAt());
            assertEquals(courseDtosFromDB.get(i).getSubject(), courses.get(i).getSubject());
        }
    }

    @Test
    public void deleteCourses() throws Exception {
        List<CourseDto> before = databaseManipulator.getCourses();
        addCoursesToDatabase();

        for (CourseDto courseDto: courses) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL)
                    .param("id", courseDto.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<CourseDto> after = databaseManipulator.getCourses();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    @Test
    public void getNonExistingCourse() throws Exception {
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + courses.get(0).getId())
                .header("Authorization", "Bearer " + userDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        String content = mvcResult.getResponse().getErrorMessage();

        assertEquals(404, status);
        assertEquals("Entity of class 'Course' with id: '" + courses.get(0).getId() +"' not found", content);
    }

    @Test
    public void updateNonExistingCourse() throws Exception {
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                .content(super.mapToJson(courses.get(0)))
                .header("Authorization", "Bearer " + userDto.getToken())
        ).andReturn();
        int status = mvcResult.getResponse().getStatus();
        String content = mvcResult.getResponse().getErrorMessage();

        assertEquals(404, status);
        assertEquals("Entity of class 'Course' with id: '" + courses.get(0).getId() +"' not found", content);
    }

    @Test
    public void deleteNonExistingCourse() throws Exception {
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL)
                .param("id", "0")
                .header("Authorization", "Bearer " + userDto.getToken())
        ).andReturn();


        int status = mvcResult.getResponse().getStatus();
        String content = mvcResult.getResponse().getErrorMessage();

        assertEquals(404, status);
        assertEquals("Entity of class 'Course' with id: '0' not found", content);
    }

    private void addParticipants(CourseDto courseDto, List<ParticipantDto> participantDtos) {
        List<String> participantIds = new ArrayList<>();


        for (ParticipantDto participantDto : participantDtos) {
            participantIds.add(participantDto.getId());
        }

        courseDto.setParticipantIds(participantIds);
    }

}
