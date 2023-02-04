package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.mapper.courses.SessionMapper;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.repositories.SessionRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Instant;
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

    private List<SessionDto> sessions;

    @Before
    @Override
    public void setUp() {
        super.setUp();
        this.sessions = addSomeSessions();
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
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
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

        for (SessionDto participant: sessions) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + participant.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            SessionDto sessionDto = super.mapFromJson(content, SessionDto.class);


            assertEquals(sessionDto, participant);
        }

        deleteFromDataBase();
    }

    @Test
    public void getAllSessions() throws Exception {
        addSessionToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                //.accept(MediaType.APPLICATION_JSON_VALUE)
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        List<SessionDto> participantDtos = Arrays.asList(super.mapFromJson(content, SessionDto[].class));

        participantDtos.sort(Comparator.naturalOrder());
        sessions.sort(Comparator.naturalOrder());


        for (int i= 0; i < sessions.size(); i++) {
            assertEquals(sessions.get(i), participantDtos.get(i));
        }

        deleteFromDataBase();
    }

    @Test
    public void deleteSessions() throws Exception {
        List<SessionDto> before = getSessionFromDataBase();
        addSessionToDatabase();

        for (SessionDto sessionDto: sessions) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(sessionDto.getId()).param("id", sessionDto.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
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
        sessionDto.setUserId("4ccc614c-fda8-471d-b444-c70ca756cf0b");
        sessionDto.setCourseId("95d40763-b581-4d22-99b7-05dd58b0b3f3");
        
        sessionDto.setDate(Timestamp.from(Instant.now()).toString());

        return sessionDto;
    }
}
