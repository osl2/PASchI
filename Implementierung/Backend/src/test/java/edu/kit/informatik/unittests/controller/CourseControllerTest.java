package edu.kit.informatik.unittests.controller;

import edu.kit.informatik.dto.mapper.courses.CourseMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;


import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class CourseControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/course";

    @Autowired
    private CourseMapper courseMapper;

    private List<CourseDto> courseDtos;


    @Test
    public void getAllCourses() throws Exception{

    }
}
