package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
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
            userdto.setPassword(userdto.getPassword().substring(8));
            assertTrue(new BCryptPasswordEncoder().matches(users.get(i).getPassword(), userdto.getPassword()));
            assertEquals(users.get(i).getFirstName(), userdto.getFirstName());
            assertEquals(users.get(i).getLastName(), userdto.getLastName());
            assertEquals(users.get(i).getRole(), userdto.getRole());
            users.set(i, userdto);
        }
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
            assertEquals(users.get(i).getPassword(), userFromDataBase.get(i).getPassword());
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


            assertEquals(user.getEmail(), userdto.getEmail());
            userdto.setPassword(userdto.getPassword().substring(8));
            assertTrue(new BCryptPasswordEncoder().matches(user.getPassword(), userdto.getPassword()));
            assertEquals(user.getFirstName(), userdto.getFirstName());
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
            assertEquals(users.get(i).getEmail(), userDtos.get(i).getEmail());
            userDtos.get(i).setPassword(userDtos.get(i).getPassword().substring(8));
            assertTrue(new BCryptPasswordEncoder().matches(users.get(i).getPassword(), userDtos.get(i).getPassword()));
            assertEquals(users.get(i).getFirstName(), userDtos.get(i).getFirstName());
            assertEquals(users.get(i).getLastName(), userDtos.get(i).getLastName());
            assertEquals(users.get(i).getRole(), userDtos.get(i).getRole());
        }

    }

    @Test
    public void delete() throws Exception {
        List<UserDto> before = databaseManipulator.getUsers();
        addUsersToDatabase();

        for (UserDto user: users) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(user.getId())
                    .param("id", user.getId())
                    .header("Authorization", "Bearer " + mainUserDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<UserDto> after = databaseManipulator.getUsers();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }
}
