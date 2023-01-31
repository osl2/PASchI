package edu.kit.informatik.unittests.controller;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.model.Role;
import edu.kit.informatik.model.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class UserControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/user";

    @Autowired
    private UserMapper userMapper;

    private List<UserDto> userDtos;

    @Before
    @Override
    public void setUp() {
        super.setUp();

    }
    /*
    private List<User> addSomeUsers() {

    }

     */


    @Test
    public void getUserList() throws Exception {
        String uri = "/api/user/admin";
        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
                .accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString();

        List<User> expectedUsers = List.of(getNewUser());
       // users.add(getNewUser());

        String expected = "[{\"id\":\"9e62c86f-945b-497d-93b3-d45b86be9a82\",\"firstName\":\"test2\",\"lastName\":\"user2\",\"email\":\"test2.user@kit.edu\",\"password\":\"password2\",\"auth\":false,\"token\":null,\"role\":\"USER\"}]";


        //assertEquals(super.mapToJson(users), content);
        List<UserDto> userDtoList = new ArrayList<UserDto>(Arrays.asList(super.mapFromJson(content, UserDto[].class)));

        List<User> userList = userMapper.dtoToModel(userDtoList);

        assertEquals(expectedUsers.size(), userList.size());
        for (int i = 0; i< expectedUsers.size(); i++) {
            //userList.get(i).setId(null);
            assertEquals(expectedUsers.get(i).toString(), userList.get(i).toString());
        }

        //assertEquals(expectedUsers., userList);

        //assertTrue(userList.length > 0);
    }

    private User getNewUser() {
        User user = new User();

        user.setRole(Role.USER);

        user.setEmail("test2.user@kit.edu");
        user.setFirstName("test2");
        user.setLastName("user2");
        user.setPassword("password2");

        return user;
    }
}
