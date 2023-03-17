package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
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
import java.util.Random;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;

public class SessionControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/session";

    @Autowired
    private DatabaseManipulator databaseManipulator;

    private CourseDto courseDto;
    private List<SessionDto> sessions;
    private UserDto userDto;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        Faker faker = new Faker(new Locale("de"));
        userDto = super.addAndLogin(EntityGenerator.createNewUser(faker));
        courseDto = databaseManipulator.addCourse(EntityGenerator.createNewCourse(faker, userDto));
        courseDto.setParticipantIds(getSomeParticipantsIds());

        this.sessions = addSomeSessions();
    }

    @After
    @Override
    public void setDown() {
        databaseManipulator.clearInteractionRepository();
        databaseManipulator.clearSessionRepository();
        databaseManipulator.clearCategoryRepository();
        databaseManipulator.clearParticipantRepository();
        databaseManipulator.clearSeatArrangementRepository();
        databaseManipulator.clearRoomRepository();
        databaseManipulator.clearCourseRepository();
        databaseManipulator.clearUserRepository();
        this.sessions.clear();
    }

    private List<SessionDto> addSomeSessions() {

        List<SessionDto> sessionDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            sessionDtos.add(EntityGenerator.createNewSession(faker, userDto, courseDto));
        }

        return sessionDtos;
    }

    private List<String> getSomeParticipantsIds() {

        List<String> participantsDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            participantsDtos.add(databaseManipulator.addParticipant(EntityGenerator.createNewParticipant(faker, userDto)).getId());
        }

        return participantsDtos;
    }

    private List<InteractionDto> getSomeInteractions(SessionDto sessionDto, List<String> participantsIds) throws InterruptedException {
        List<InteractionDto> interactionDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));
        CategoryDto categoryDto = databaseManipulator.addCategory(EntityGenerator.createNewCategory(faker, this.userDto));

        for (int i = 0; i < 10; i++) {
            Random random = new Random();
            int participantsFromIndex;
            int participantsToIndex;
            do {
                participantsFromIndex = random.nextInt(participantsIds.size());
                participantsToIndex = random.nextInt(participantsIds.size());
            } while (participantsFromIndex == participantsToIndex);

            interactionDtos.add(EntityGenerator.createNewInteraction(this.userDto, sessionDto,
                    participantsIds.get(participantsFromIndex), participantsIds.get(participantsToIndex), categoryDto));
            TimeUnit.MILLISECONDS.sleep(2);
        }

        return interactionDtos;
    }


    private void addSessionsToDatabase() {
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
                    .header("Authorization", "Bearer " + userDto.getToken())
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
        addSessionsToDatabase();

        for (SessionDto session: sessions) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + session.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
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
        addSessionsToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                .header("Authorization", "Bearer " + userDto.getToken())
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
    public void updateSessions() throws Exception {
        addSessionsToDatabase();

        List<SessionDto> sessionDtos = addSomeSessions();

        for (int i = 0; i < sessions.size(); i++) {
            sessions.get(i).setName(sessionDtos.get(i).getName());
            sessions.get(i).setInteractions(new ArrayList<>());
            sessions.get(i).setSeatArrangementId(addSeatArrangement().getId());
            sessions.get(i).setInteractions(getSomeInteractions(sessions.get(i), courseDto.getParticipantIds()));
        }

        for (SessionDto sessionDto: sessions) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(sessionDto))
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }

        List<SessionDto> sessionDtosFromDB = databaseManipulator.getSessions();

        sessionDtosFromDB.sort(Comparator.naturalOrder());
        sessions.sort(Comparator.naturalOrder());

        assertEquals(sessionDtosFromDB.size(), sessions.size());

        for (int i = 0; i < sessions.size(); i++) {
            sessionDtosFromDB.get(i).getInteractions().sort(Comparator.naturalOrder());
            sessions.get(i).getInteractions().sort(Comparator.naturalOrder());
            assertEquals(sessions.get(i).getName(), sessionDtosFromDB.get(i).getName());
            assertEquals(sessions.get(i).getCreatedAt(), sessionDtosFromDB.get(i).getCreatedAt());
            assertEquals(sessions.get(i).getSeatArrangementId(), sessionDtosFromDB.get(i).getSeatArrangementId());
            assertEquals(sessions.get(i).getInteractions().size(), sessionDtosFromDB.get(i).getInteractions().size());
            for (int j = 0; j < sessionDtosFromDB.get(i).getInteractions().size(); j++) {
                InteractionDto interactionDtoFromDB = sessionDtosFromDB.get(i).getInteractions().get(i);
                InteractionDto interactionDto = sessions.get(i).getInteractions().get(i);
                assertEquals(interactionDto.getCategoryId(), interactionDtoFromDB.getCategoryId());
                assertEquals(interactionDto.getFromParticipantId(), interactionDtoFromDB.getFromParticipantId());
                assertEquals(interactionDto.getToParticipantId(), interactionDtoFromDB.getToParticipantId());
                assertEquals(interactionDto.getCreatedAt(), interactionDtoFromDB.getCreatedAt());
            }
        }

        for (SessionDto sessionDto: sessions) {
            sessionDto.setInteractions(new ArrayList<>());
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(sessionDto))
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }


    }

    @Test
    public void deleteSessions() throws Exception {
        List<SessionDto> before = databaseManipulator.getSessions();
        addSessionsToDatabase();

        for (SessionDto sessionDto: sessions) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL)
                    .param("id", sessionDto.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
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

    @Test
    public void getNonExistingSession() throws Exception {
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + sessions.get(0).getId())
                .header("Authorization", "Bearer " + userDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        String content = mvcResult.getResponse().getErrorMessage();

        assertEquals(404, status);
        assertEquals("Entity of class 'Session' with id: '" + sessions.get(0).getId() +"' not found", content);
    }

    @Test
    public void updateNonExistingSession() throws Exception {
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                .content(super.mapToJson(sessions.get(0)))
                .header("Authorization", "Bearer " + userDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        String content = mvcResult.getResponse().getErrorMessage();

        assertEquals(404, status);
        assertEquals("Entity of class 'Session' with id: '" + sessions.get(0).getId() +"' not found", content);
    }

    @Test
    public void deleteNonExistingSession() throws Exception {
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL)
                .param("id", "0")
                .header("Authorization", "Bearer " + userDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        String content = mvcResult.getResponse().getErrorMessage();

        assertEquals(404, status);
        assertEquals("Entity of class 'Session' with id: '0' not found", content);
    }

    private SeatArrangementDto addSeatArrangement() {
        Faker faker = new Faker(new Locale("de"));
        RoomDto roomDto = databaseManipulator.addRoom(EntityGenerator.createNewRoom(faker, this.userDto));

        return databaseManipulator.addSeatArrangement(EntityGenerator.createNewSeatArrangement(faker, this.userDto, this.courseDto, roomDto));
    }
}
