package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.dto.mapper.courses.CourseMapper;
import edu.kit.informatik.dto.mapper.courses.SessionMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.interactions.Participant;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.ParticipantRepository;
import edu.kit.informatik.repositories.SessionRepository;
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

public class SessionControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/session";


    @Autowired
    private SessionMapper sessionMapper;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseMapper courseMapper;

    private List<SessionDto> sessions;

    @Before
    @Override
    public void setUp() {
        super.setUp();
        this.sessions = addSomeSessions();
    }

    @After
    @Override
    public void setDown() {
        this.sessionRepository.deleteAll();
        this.participantRepository.deleteAll();
        this.courseRepository.deleteAll();
        this.userRepository.deleteAll();
    }

    private List<SessionDto> addSomeSessions() {

        List<SessionDto> sessionDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            sessionDtos.add(getNewSession(faker));
        }

        return sessionDtos;
    }


    private void addSessionToDatabase() {
        List<SessionDto> repositoryUser = new ArrayList<>();
        for (SessionDto sessionDto: this.sessions) {
            repositoryUser.add(sessionMapper.modelToDto(this.sessionRepository.save(sessionMapper.dtoToModel(sessionDto))));
        }

        assertEquals(sessions.size(), repositoryUser.size());
        for (int i= 0; i< sessions.size(); i++) {
            assertEquals(sessions.get(i).getName(), repositoryUser.get(i).getName());
            assertEquals(sessions.get(i).getUserId(), repositoryUser.get(i).getUserId());
            assertEquals(sessions.get(i).getDate(), repositoryUser.get(i).getDate());
            assertEquals(sessions.get(i).getCourseId(), repositoryUser.get(i).getCourseId());
            assertEquals(sessions.get(i).getSeatArrangementId(), repositoryUser.get(i).getSeatArrangementId());
        }

        this.sessions = repositoryUser;
    }

    private void deleteFromDataBase() {

        for (SessionDto sessionDto: sessions) {
            if (sessionDto.getId() != null) {
                this.sessionRepository.deleteById(sessionDto.getId());
            }
        }

        sessions.clear();
    }

    @Test
    public void addSessions() throws Exception {

        for (int i = 0; i< sessions.size(); i++) {

            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                            .content(super.mapToJson(sessions.get(i)))
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            SessionDto sessionDto = super.mapFromJson(content, SessionDto.class);


            assertEquals(sessions.get(i).getName(), sessionDto.getName());
            assertEquals(sessions.get(i).getUserId(), sessionDto.getUserId());
            assertEquals(sessions.get(i).getDate(), sessionDto.getDate());
            assertEquals(sessions.get(i).getCourseId(), sessionDto.getCourseId());
            assertEquals(sessions.get(i).getSeatArrangementId(), sessionDto.getSeatArrangementId());
            sessions.set(i, sessionDto);
        }
        deleteFromDataBase();
    }


    @Test
    public void getOneSession() throws Exception {
        addSessionToDatabase();

        for (SessionDto session: sessions) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + session.getId())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            SessionDto sessionDto = super.mapFromJson(content, SessionDto.class);


            assertEquals(sessionDto, session);
        }

        deleteFromDataBase();
    }

    @Test
    public void getAllSessions() throws Exception {
        addSessionToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        List<SessionDto> sessionDto = Arrays.asList(super.mapFromJson(content, SessionDto[].class));

        sessionDto.sort(Comparator.naturalOrder());
        sessions.sort(Comparator.naturalOrder());


        for (int i= 0; i < sessions.size(); i++) {
            assertEquals(sessions.get(i), sessionDto.get(i));
        }

        deleteFromDataBase();
    }

    @Test
    public void deleteSessions() throws Exception {
        List<SessionDto> before = getSessionFromDataBase();
        addSessionToDatabase();

        for (SessionDto sessionDto: sessions) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(sessionDto.getId()).param("id", sessionDto.getId())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<SessionDto> after = getSessionFromDataBase();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    private List<SessionDto> getSessionFromDataBase() {
        return sessionMapper.modelToDto(this.sessionRepository.findAll());
    }


    private SessionDto getNewSession(Faker faker) {
        SessionDto sessionDto = new SessionDto();

        sessionDto.setName(faker.funnyName().name());
        User user = userRepository.save(userMapper.dtoToModel(getNewUser(faker)));
        sessionDto.setUserId(user.getId());
        Course course = courseRepository.save(courseMapper.dtoToModel(getNewCourse(faker, user.getId())));
        sessionDto.setCourseId(course.getId());
        sessionDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

        sessionDto.setDate(Timestamp.from(Instant.now()).toString());

        return sessionDto;
    }

    private List<InteractionDto> addInteractions(Faker faker, String sessionId, String userId) {

        List<Participant> participants = participantRepository.findAll();

        List<InteractionDto> interactionDtos = new ArrayList<>();

        for (int i = 0; i < 20; i++) {

            String fromId = participants.get(faker.number().numberBetween(0, participants.size())).getId();
            String toId;

            do {
                toId = participants.get(faker.number().numberBetween(0, participants.size())).getId();
            } while (fromId.equals(toId));

            InteractionDto interactionDto = new InteractionDto();

            interactionDto.setSessionId(sessionId);
            interactionDto.setTimeStamp(Timestamp.from(Instant.now()).toString());
            interactionDto.setCategoryId("");
            interactionDto.setUserId(userId);
            interactionDto.setFromParticipantId(fromId);
            interactionDto.setToParticipantId(toId);
            interactionDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

            interactionDtos.add(interactionDto);
        }

        return interactionDtos;
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

    private CourseDto getNewCourse(Faker faker, String userId) {

        CourseDto courseDto = new CourseDto();

        String name = faker.team().name();

        courseDto.setName(name + " " + faker.number().randomDigit());
        courseDto.setSubject(name);
        courseDto.setUserId(userId);
        courseDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

        return courseDto;
    }
}
