package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.InteractionDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.unittests.DatabaseManipulator;
import edu.kit.informatik.unittests.EntityGenerator;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import static edu.kit.informatik.service.UserService.EMAIL_ALREADY_EXITS;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class UserControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/user";

    @Autowired
    DatabaseManipulator databaseManipulator;

    private List<UserDto> users;

    private UserDto mainUserDto;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        mainUserDto = super.addAndLogin(EntityGenerator.createNewAdmin(new Faker(new Locale("de"))));
        this.users = getNewUsers();
    }

    @After
    @Override
    public void setDown() {
        databaseManipulator.clearUserRepository();
        this.users.clear();
    }


    private List<UserDto> getNewUsers() {

        List<UserDto> users = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            users.add(EntityGenerator.createNewUser(faker));
        }

        return users;
    }

    private void addUsersToDatabase() {
        List<UserDto> repositoryUser = new ArrayList<>();
        for (UserDto user: this.users) {
            repositoryUser.add(databaseManipulator.addUser(user));
        }

        this.users = repositoryUser;
    }

    @Test
    public void login() throws Exception {
        Faker faker = new Faker(new Locale("de"));
        UserDto userDto = EntityGenerator.createNewUser(faker);
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                .content(super.mapToJson(userDto))
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        UserDto repoDto = super.mapFromJson(content, UserDto.class);
        MvcResult mvcResultLogin = mvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                .param("email", repoDto.getEmail()).param("password", userDto.getPassword())
        ).andReturn();
        int statusLogin = mvcResultLogin.getResponse().getStatus();
        assertEquals(200, statusLogin);
        String contentLogin = mvcResultLogin.getResponse().getContentAsString(StandardCharsets.UTF_8);

        UserDto contentDto = super.mapFromJson(contentLogin, UserDto.class);

        assertNotNull(contentDto.getToken());
    }

    @Test
    public void getNewToken() throws Exception {
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/token")
                .header("Authorization", "Bearer " + mainUserDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        UserDto repoDto = super.mapFromJson(content, UserDto.class);

        assertNotEquals(mainUserDto.getToken(), repoDto.getToken());
        assertEquals(mainUserDto.getEmail(), repoDto.getEmail());
        repoDto.setPassword(repoDto.getPassword().substring(8));
        assertTrue(new BCryptPasswordEncoder().matches(mainUserDto.getPassword(), repoDto.getPassword()));
        assertEquals(mainUserDto.getFirstName(), repoDto.getFirstName());
        assertEquals(mainUserDto.getLastName(), repoDto.getLastName());
        assertEquals(mainUserDto.getRole(), repoDto.getRole());
    }

    @Test
    public void wrongUsernameLogin() throws Exception {
        Faker faker = new Faker(new Locale("de"));
        UserDto userDto = EntityGenerator.createNewUser(faker);
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                .content(super.mapToJson(userDto))
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);

        MvcResult mvcResultLogin = mvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                .param("email", "123@kit.edu").param("password", userDto.getPassword())
        ).andReturn();
        int statusLogin = mvcResultLogin.getResponse().getStatus();
        String content = mvcResultLogin.getResponse().getErrorMessage();
        System.out.println(content);
        assertEquals(401, statusLogin);

    }

    @Test
    public void addUsers() throws Exception {

        for (int i = 0; i< users.size(); i++) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(users.get(i)))
                    .header("Authorization", "Bearer " + mainUserDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            UserDto userdto = super.mapFromJson(content, UserDto.class);

            assertEquals(users.get(i).getEmail(), userdto.getEmail());
            assertEquals(users.get(i).getFirstName(), userdto.getFirstName());
            assertEquals(users.get(i).getLastName(), userdto.getLastName());
            assertEquals(users.get(i).getRole(), userdto.getRole());
            users.set(i, userdto);
        }
    }

    @Test
    public void addUsersWithExistingEmail() throws Exception {
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                .content(super.mapToJson(mainUserDto))
                .header("Authorization", "Bearer " + mainUserDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(400, status);

        String content = mvcResult.getResponse().getErrorMessage();
        assertEquals(EMAIL_ALREADY_EXITS, content);
    }

    @Test
    public void updateUser() throws Exception {
        addUsersToDatabase();

        List<UserDto> newUsers = getNewUsers();

        for (int i = 0; i < users.size(); i++) {
            users.set(i, super.login(users.get(i)));

            users.get(i).setFirstName(newUsers.get(i).getFirstName());
            users.get(i).setLastName(newUsers.get(i).getLastName());
            users.get(i).setRole(RoleDto.ADMIN);
            users.get(i).setPassword(newUsers.get(i).getPassword());
            users.get(i).setAuth(false);
        }

        for (UserDto userDto: users) {

            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                        .content(super.mapToJson(userDto))
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }

        List<UserDto> userFromDataBase = databaseManipulator.getUsers();
        for (UserDto userDto: userFromDataBase) {
            if (Objects.equals(userDto.getId(), mainUserDto.getId())) {
                userFromDataBase.remove(userDto);
                break;
            }
        }

        userFromDataBase.sort(Comparator.naturalOrder());
        users.sort(Comparator.naturalOrder());

        assertEquals(userFromDataBase.size(), users.size());

        for (int i = 0; i < users.size(); i++) {
            assertEquals(users.get(i).getFirstName(), userFromDataBase.get(i).getFirstName());
            assertEquals(users.get(i).getLastName(), userFromDataBase.get(i).getLastName());
            assertNotEquals(users.get(i).getRole(), userFromDataBase.get(i).getRole());
            assertNotEquals(users.get(i).isAuth(), userFromDataBase.get(i).isAuth());
        }
    }

    @Test
    public void adminUpdateUser() throws Exception {
        addUsersToDatabase();

        List<UserDto> newUsers = getNewUsers();

        for (int i = 0; i < users.size(); i++) {
            users.get(i).setFirstName(newUsers.get(i).getFirstName());
            users.get(i).setLastName(newUsers.get(i).getLastName());
            users.get(i).setRole(RoleDto.ADMIN);
            users.get(i).setPassword(newUsers.get(i).getPassword());
            users.get(i).setAuth(false);
        }

        for (UserDto userDto: users) {

            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URL + "/admin").contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(userDto))
                    .header("Authorization", "Bearer " + mainUserDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }

        List<UserDto> userFromDataBase = databaseManipulator.getUsers();
        for (UserDto userDto: userFromDataBase) {
            if (Objects.equals(userDto.getId(), mainUserDto.getId())) {
                userFromDataBase.remove(userDto);
                break;
            }
        }

        userFromDataBase.sort(Comparator.naturalOrder());
        users.sort(Comparator.naturalOrder());

        assertEquals(userFromDataBase.size(), users.size());

        for (int i = 0; i < users.size(); i++) {
            assertNotEquals(users.get(i).getFirstName(), userFromDataBase.get(i).getFirstName());
            assertNotEquals(users.get(i).getLastName(), userFromDataBase.get(i).getLastName());
            assertNotEquals(users.get(i).getPassword(), userFromDataBase.get(i).getPassword());
            assertEquals(users.get(i).getRole(), userFromDataBase.get(i).getRole());
            assertEquals(users.get(i).isAuth(), userFromDataBase.get(i).isAuth());
        }
    }

    @Test
    public void getOneUser() throws Exception {
        addUsersToDatabase();

        for (UserDto user: users) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + user.getId())
                    .header("Authorization", "Bearer " + mainUserDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            UserDto userdto = super.mapFromJson(content, UserDto.class);


            assertEquals(user.getEmail(), userdto.getEmail());assertEquals(user.getFirstName(), userdto.getFirstName());
            assertEquals(user.getLastName(), userdto.getLastName());
            assertEquals(user.getRole(), userdto.getRole());
        }

    }

    @Test
    public void getAllUser() throws Exception {
        addUsersToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/admin")
                .header("Authorization", "Bearer " + mainUserDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        List<UserDto> userDtos = Arrays.asList(super.mapFromJson(content, UserDto[].class));
        users.add(this.mainUserDto);

        userDtos.sort(Comparator.naturalOrder());
        users.sort(Comparator.naturalOrder());



        for (int i= 0; i < users.size(); i++) {
            assertEquals(users.get(i).getEmail(), userDtos.get(i).getEmail());assertEquals(users.get(i).getFirstName(), userDtos.get(i).getFirstName());
            assertEquals(users.get(i).getLastName(), userDtos.get(i).getLastName());
            assertEquals(users.get(i).getRole(), userDtos.get(i).getRole());
        }

    }

    @Test
    public void delete() throws Exception {
        List<UserDto> before = databaseManipulator.getUsers();
        addUsersToDatabase();

        for (UserDto user: users) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL)
                    .param("id", user.getId())
                    .header("Authorization", "Bearer " + mainUserDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<UserDto> after = databaseManipulator.getUsers();

        assertEquals(before.size(), after.size());

        //Es sollte nur der Admin-Account da sein
        assertEquals(1, databaseManipulator.getUsers().size());
        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    @Test
    public void deleteUserWithAllEntities() throws Exception {
        List<UserDto> before = databaseManipulator.getUsers();
        addUsersToDatabase();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < users.size(); i++) {
            users.set(i, super.login(users.get(i)));

            ParticipantDto participantDto1 = databaseManipulator.addParticipant(EntityGenerator.createNewParticipant(faker, users.get(i)));
            ParticipantDto participantDto2 = databaseManipulator.addParticipant(EntityGenerator.createNewParticipant(faker, users.get(i)));

            CourseDto courseDto = databaseManipulator.addCourse(EntityGenerator.createNewCourse(faker, users.get(i)));
            List<String> participantsIds = new ArrayList<>();
            participantsIds.add(participantDto1.getId());
            participantsIds.add(participantDto2.getId());
            courseDto.setParticipantIds(participantsIds);

            RoomDto roomDto = databaseManipulator.addRoom(EntityGenerator.createNewRoom(faker, users.get(i)));
            SeatArrangementDto seatArrangementDto = databaseManipulator.addSeatArrangement(
                    EntityGenerator.createNewSeatArrangement(faker, users.get(i), courseDto, roomDto));

            List<String> seatArrangementIds = new ArrayList<>();
            seatArrangementIds.add(seatArrangementDto.getId());
            courseDto.setSeatArrangementIds(seatArrangementIds);

            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put("/api/course").contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(courseDto))
                    .header("Authorization", "Bearer " + users.get(i).getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);

            CategoryDto category = databaseManipulator.addCategory(EntityGenerator.createNewCategory(faker, users.get(i)));

            SessionDto sessionDto = databaseManipulator.addSession(EntityGenerator.createNewSession(faker, users.get(i), courseDto));

            InteractionDto interactionDto = EntityGenerator.createNewInteraction(users.get(i), sessionDto, participantDto1.getId(),
                   participantDto2.getId(), category);
            List<InteractionDto> list = new ArrayList<>();
            list.add(interactionDto);
            sessionDto.setInteractions(list);
            sessionDto.setSeatArrangementId(seatArrangementDto.getId());



            MvcResult mvcResult3 = mvc.perform(MockMvcRequestBuilders.put("/api/session").contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(sessionDto))
                    .header("Authorization", "Bearer " + users.get(i).getToken())
            ).andReturn();

            int status3 = mvcResult3.getResponse().getStatus();
            assertEquals(200, status3);

            databaseManipulator.addRoom(EntityGenerator.createNewRoom(faker, users.get(i)));



            MvcResult mvcResult2 = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL)
                    .param("id", users.get(i).getId())
                    .header("Authorization", "Bearer " + mainUserDto.getToken())
            ).andReturn();

            int status2 = mvcResult2.getResponse().getStatus();
            assertEquals(200, status2);
        }
        List<UserDto> after = databaseManipulator.getUsers();

        assertEquals(before.size(), after.size());

        //Es sollte nur der Admin-Account da sein
        assertEquals(1, databaseManipulator.getUsers().size());
        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }
    }

    @Test
    public void adminUpdateWithNotExistingUser() throws Exception {
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URL + "/admin").contentType(MediaType.APPLICATION_JSON)
                .content(super.mapToJson(users.get(0)))
                .header("Authorization", "Bearer " + mainUserDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        String content = mvcResult.getResponse().getErrorMessage();

        assertEquals(404, status);
        assertEquals("Entity of class 'User' with id: '" + users.get(0).getId() + "' not found", content);
    }
}
