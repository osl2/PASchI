package edu.kit.informatik.unittests.controller;


import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.dto.mapper.courses.CourseMapper;
import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantTypeDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.ParticipantRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
    private CourseRepository courseRepository;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private ParticipantMapper participantMapper;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    private List<CourseDto> courses;

    @Before
    @Override
    public void setUp() {
        super.setUp();
        this.courses = addSomeCourses();
    }

    @After
    @Override
    public void setDown() {
        this.courseRepository.deleteAll();
        this.participantRepository.deleteAll();
        this.userRepository.deleteAll();
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

    private void addCourseToDatabase() {
        List<CourseDto> repositoryCourse = new ArrayList<>();
        for (CourseDto courseDto: this.courses) {
            repositoryCourse.add(courseMapper.modelToDto(this.courseRepository.save(courseMapper.dtoToModel(courseDto))));
        }

        assertEquals(courses.size(), repositoryCourse.size());
        for (int i= 0; i< courses.size(); i++) {
            assertEquals(courses.get(i).getUserId(), repositoryCourse.get(i).getUserId());
            assertEquals(courses.get(i).getName(), repositoryCourse.get(i).getName());
            assertEquals(courses.get(i).getSubject(), repositoryCourse.get(i).getSubject());
            assertNotNull(repositoryCourse.get(i).getId());
        }

        this.courses = repositoryCourse;
    }

    @Test
    public void addCourses() throws Exception{
        for (CourseDto courseDto: courses) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                            .content(super.mapToJson(courseDto))
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

    @Test
    public void deleteCourses() throws Exception {
        List<CourseDto> before = getCoursesFromDataBase();
        addCourseToDatabase();

        for (CourseDto courseDto: courses) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(courseDto.getId()).param("id", courseDto.getId())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<CourseDto> after = getCoursesFromDataBase();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    private List<CourseDto> getCoursesFromDataBase() {
        return courseMapper.modelToDto(this.courseRepository.findAll());
    }


    private CourseDto getNewCourse(Faker faker) {

        CourseDto courseDto = new CourseDto();

        String name = faker.team().name();

        courseDto.setName(name + " " + faker.number().randomDigit());
        courseDto.setSubject(name);
        User user = this.userRepository.save(userMapper.dtoToModel(getNewUser(faker)));
        courseDto.setUserId(user.getId());
        courseDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

        List<String> participantIds = new ArrayList<>();


        for (int i = 0; i < 10; i++) {
            Participant participant = participantRepository.save(participantMapper.dtoToModel(
                                                                    getNewParticipant(faker, user.getId())));

            participantIds.add(participant.getId());
        }

        courseDto.setParticipantIds(participantIds);

        return courseDto;
    }

    private ParticipantDto getNewParticipant(Faker faker, String userId) {
        ParticipantDto participantDto = new ParticipantDto();

        participantDto.setParticipantType(ParticipantTypeDto.Student);

        participantDto.setUserId(userId);
        participantDto.setFirstName(faker.name().firstName());
        participantDto.setLastName(faker.name().lastName());
        participantDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));
        participantDto.setVisible(true);

        return participantDto;
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
        userDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));


        return userDto;
    }
}
