package edu.kit.informatik.unittests.controller;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.model.Role;
import edu.kit.informatik.model.User;
import edu.kit.informatik.service.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

//import static org.junit.jupiter.api.AssertEquals.assertEquals;

import static org.junit.Assert.assertEquals;


@RunWith(SpringRunner.class)
@WebMvcTest(UserControllerTest.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserMapper userMapper;

    @Test
    public void getUserById() throws Exception {
        //User user = getNewUser();
        //UserDto userDto = userMapper.modelToDto(user);

        //given(userService.add(userDto)).willReturn(userDto);


        RequestBuilder request = MockMvcRequestBuilders.get("/api/user/admin").contentType(MediaType.APPLICATION_JSON);

        MvcResult result = mockMvc.perform(request)
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("test2.user@kit.edu"))
                .andReturn();

        assertEquals(result.getResponse().getContentAsString(), " ");



        //MockHttpServletResponse response = mockMvc.perform((RequestBuilder) post("/api/users").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());


    }

    private User getNewUser() {
        User user = new User();
        user.setRole(Role.USER);

        user.setEmail("testuser@test.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setPassword("passwort");

        return user;
    }
}
