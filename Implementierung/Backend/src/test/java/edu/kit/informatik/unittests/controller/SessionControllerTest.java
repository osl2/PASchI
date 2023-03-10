package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
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
    private DatabaseManipulator databaseManipulator;

    private CourseDto course;
    private List<SessionDto> sessions;
    private UserDto userDto;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        Faker faker = new Faker(new Locale("de"));
        userDto = super.addAndLogin(EntityGenerator.createNewUser(faker));
        course = EntityGenerator.createNewCourse(faker, userDto);
        this.sessions = addSomeSessions();
    }

    @After
    @Override
    public void setDown() {
        databaseManipulator.clearSessionRepository();
        databaseManipulator.clearParticipantRepository();
        databaseManipulator.clearCourseRepository();
        databaseManipulator.clearUserRepository();
        this.sessions.clear();
    }

    private List<SessionDto> addSomeSessions() {

        List<SessionDto> sessionDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            sessionDtos.add(EntityGenerator.createNewSession(faker, course, userDto));
        }

        return sessionDtos;
    }


    private void addSessionToDatabase() {
        List<SessionDto> repositoryUser = new ArrayList<>();
        for (SessionDto sessionDto: this.sessions) {
            repositoryUser.add(databaseManipulator.addSession(sessionDto));
        }

        this.sessions = repositoryUser;
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
    }

    @Test
    public void deleteSessions() throws Exception {
        List<SessionDto> before = databaseManipulator.getSessions();
        addSessionToDatabase();

        for (SessionDto sessionDto: sessions) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(sessionDto.getId()).param("id", sessionDto.getId())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<SessionDto> after = databaseManipulator.getSessions();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    private List<InteractionDto> addInteractions(Faker faker, String sessionId, String userId) {

        List<ParticipantDto> participants = databaseManipulator.getParticipants();

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
}
