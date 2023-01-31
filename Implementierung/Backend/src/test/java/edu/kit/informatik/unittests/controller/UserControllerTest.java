package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.model.Role;
import edu.kit.informatik.model.User;
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

    private List<User> users;

    @Before
    @Override
    public void setUp() {
        super.setUp();
        this.users = addSomeUsers();
    }


    private List<User> addSomeUsers() {

        List<User> users = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            users.add(getNewUser(faker));
        }

        return users;
    }

    private void addUserToDatabase() {
        List<User> repositoryUser = new ArrayList<>();
        for (User user: this.users) {
            repositoryUser.add(this.userRepository.save(user));
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
        for (User user: users) {
            if (user.getId() != null) {
                this.userRepository.deleteById(user.getId());
            }
        }

        users.clear();
    }

    @Test
    public void addUsers() throws Exception {
        //System.out.println(users.get(0).toString());
        //System.out.println(super.mapToJson(userMapper.modelToDto(users.get(0))));
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                .content(super.mapToJson(userMapper.modelToDto(users.get(0))))
                //.accept(MediaType.APPLICATION_JSON_VALUE)
                ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);
        //System.out.println(content);
        UserDto userdto = super.mapFromJson(content, UserDto.class);
        User user = userMapper.dtoToModel(userdto);

        assertEquals(users.get(0).getEmail(), user.getEmail());
        assertEquals(users.get(0).getPassword(), user.getPassword());
        assertEquals(users.get(0).getFirstName(), user.getFirstName());
        assertEquals(users.get(0).getLastName(), user.getLastName());
        assertEquals(users.get(0).getRole(), user.getRole());
        users.set(0, user);
        deleteFromDataBase();
    }

    @Test
    public void getOneUser() throws Exception {
        addUserToDatabase();

        for (User user: users) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + user.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);
            //System.out.println(content);
            UserDto userdto = super.mapFromJson(content, UserDto.class);
            User user1 = userMapper.dtoToModel(userdto);


            assertEquals(user, user1);
        }

        deleteFromDataBase();
    }

    @Test
    public void getAllUser() throws Exception {
        addUserToDatabase();
        User testUser = userMapper.dtoToModel(
                new UserDto("9e62c86f-945b-497d-93b3-d45b86be9a82", "test2", "user2",
                        "test2.user@kit.edu", "password2", false, "", RoleDto.USER));

        users.add(testUser);

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/admin")
                //.accept(MediaType.APPLICATION_JSON_VALUE)
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);
        //System.out.println(content);
        List<UserDto> userDtos = List.of(super.mapFromJson(content, UserDto[].class));
        List<User> userList = userMapper.dtoToModel(userDtos);

        assertEquals(userDtos.size(), userList.size());

        userList.sort(Comparator.naturalOrder());
        users.sort(Comparator.naturalOrder());


        for (int i= 0; i < users.size(); i++) {
            assertEquals(users.get(i), userList.get(i));
        }

        users.remove(testUser);

        deleteFromDataBase();
    }

    @Test
    public void delete() throws Exception {
        List<User> before = getUserFromDataBase();
        addUserToDatabase();

        for (User user: users) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(user.getId()).param("id", user.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<User> after = getUserFromDataBase();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    private List<User> getUserFromDataBase() {
        return this.userRepository.findAll();
    }



    private User getNewUser(Faker faker) {
        User user = new User();
        user.setRole(Role.USER);

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();

        user.setEmail(firstName + "." + lastName +  "@kit.edu");
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(faker.crypto().md5());

        return user;
    }
}
