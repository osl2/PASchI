package edu.kit.informatik.unittests.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.kit.informatik.PAschIApplication;
import edu.kit.informatik.dto.UserDto;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParseException;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = PAschIApplication.class)
@WebAppConfiguration
public abstract class AbstractTest {
    protected MockMvc mvc;
    @Autowired
    WebApplicationContext webApplicationContext;

    @Autowired
    DatabaseInserter databaseInserter;

    protected void setUp() {
        mvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).apply(SecurityMockMvcConfigurers.springSecurity()).build();
    }

    abstract void setDown();
    protected String mapToJson(Object obj) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(obj);
    }

    protected <T> T mapFromJson(String json, Class<T> clazz)
            throws JsonParseException, JsonMappingException, IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(json, clazz);
    }

    protected UserDto addAndLogin(UserDto userDto) throws Exception {
        databaseInserter.addUserToDatabase(userDto);

        MvcResult mvcResultLogin = mvc.perform(MockMvcRequestBuilders.post("/api/user" + "/login")
                .param("email", userDto.getEmail()).param("password", userDto.getPassword())
        ).andReturn();

        return mapFromJson(mvcResultLogin.getResponse().getContentAsString(StandardCharsets.UTF_8),
                UserDto.class);
    }
}
