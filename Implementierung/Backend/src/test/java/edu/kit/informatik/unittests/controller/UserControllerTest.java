package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.repositories.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;;
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

public class UserControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/user";


    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserRepository userRepository;

    private List<UserDto> users;

    @Before
    @Override
    public void setUp() {
        super.setUp();
        this.users = addSomeUsers();
    }


    private List<UserDto> addSomeUsers() {

        List<UserDto> users = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            users.add(getNewUser(faker));
        }

        return users;
    }

    private void addUserToDatabase() {
        List<UserDto> repositoryUser = new ArrayList<>();
        for (UserDto user: this.users) {
            repositoryUser.add(userMapper.modelToDto(this.userRepository.save(userMapper.dtoToModel(user))));
        }

        assertEquals(users.size(), repositoryUser.size());
        for (int i= 0; i< users.size(); i++) {
            assertEquals(users.get(i).getEmail(), repositoryUser.get(i).getEmail());
            assertEquals(users.get(i).getPassword(), repositoryUser.get(i).getPassword());
            assertEquals(users.get(i).getFirstName(), repositoryUser.get(i).getFirstName());
            assertEquals(users.get(i).getLastName(), repositoryUser.get(i).getLastName());
            assertEquals(users.get(i).getRole(), repositoryUser.get(i).getRole());
        }

        this.users = repositoryUser;
    }

    private void deleteFromDataBase() {

        for (UserDto user: users) {
            if (user.getId() != null) {
                this.userRepository.deleteById(user.getId());
            }
        }

        users.clear();
    }

    @Test
    public void addUsers() throws Exception {

        for (int i = 0; i< users.size(); i++) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                            .content(super.mapToJson(users.get(i)))
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            UserDto userdto = super.mapFromJson(content, UserDto.class);

            assertEquals(users.get(i).getEmail(), userdto.getEmail());
            assertEquals(users.get(i).getPassword(), userdto.getPassword());
            assertEquals(users.get(i).getFirstName(), userdto.getFirstName());
            assertEquals(users.get(i).getLastName(), userdto.getLastName());
            assertEquals(users.get(i).getRole(), userdto.getRole());
            users.set(i, userdto);
        }
        deleteFromDataBase();
    }

    @Test
    public void updateUser() throws Exception {
        addUserToDatabase();

        List<UserDto> newUsers = new ArrayList<>();

        for (int i = 0; i < users.size(); i++) {
            newUsers.add(getNewUser(new Faker()));
        }

        for (int i = 0; i < users.size(); i++) {
            users.get(i).setFirstName(newUsers.get(i).getFirstName());
            users.get(i).setLastName(newUsers.get(i).getLastName());
            users.get(i).setRole(newUsers.get(i).getRole());
            users.get(i).setPassword(newUsers.get(i).getPassword());
            users.get(i).setAuth(newUsers.get(i).isAuth());
        }

        for (UserDto userDto: users) {

            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                            .content(super.mapToJson(userDto))
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }

        List<UserDto> userFromDataBase = getUserFromDataBase();

        userFromDataBase.sort(Comparator.naturalOrder());
        users.sort(Comparator.naturalOrder());

        assertEquals(userFromDataBase.size(), users.size());

        for (int i = 0; i < users.size(); i++) {
            assertEquals(users.get(i), userFromDataBase.get(i));
        }

        deleteFromDataBase();
    }

    @Test
    public void getOneUser() throws Exception {
        addUserToDatabase();

        for (UserDto user: users) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + user.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            UserDto userdto = super.mapFromJson(content, UserDto.class);


            assertEquals(user, userdto);
        }

        deleteFromDataBase();
    }

    @Test
    public void getAllUser() throws Exception {
        addUserToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/admin")
                //.accept(MediaType.APPLICATION_JSON_VALUE)
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        List<UserDto> userDtos = Arrays.asList(super.mapFromJson(content, UserDto[].class));

        userDtos.sort(Comparator.naturalOrder());
        users.sort(Comparator.naturalOrder());


        for (int i= 0; i < users.size(); i++) {
            assertEquals(users.get(i), userDtos.get(i));
        }

        deleteFromDataBase();
    }

    @Test
    public void delete() throws Exception {
        List<UserDto> before = getUserFromDataBase();
        addUserToDatabase();

        for (UserDto user: users) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(user.getId()).param("id", user.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<UserDto> after = getUserFromDataBase();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    private List<UserDto> getUserFromDataBase() {
        return userMapper.modelToDto(this.userRepository.findAll());
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
