package edu.kit.informatik.unittests.controller;


import com.github.javafaker.Faker;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class SeatArrangementControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/seatarrangement";

    @Autowired
    private DatabaseManipulator databaseManipulator;

    private List<SeatArrangementDto> seatArrangements;
    private UserDto userDto;
    private RoomDto roomDto;
    private CourseDto courseDto;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        Faker faker = new Faker(new Locale("de"));
        userDto = super.addAndLogin(EntityGenerator.createNewUser(faker));
        courseDto = databaseManipulator.addCourse(EntityGenerator.createNewCourse(faker, userDto));
        roomDto = databaseManipulator.addRoom(EntityGenerator.createNewRoom(faker, userDto));
        this.seatArrangements = addSomeSeatArrangements();
    }

    @After
    @Override
    public void setDown() {
        databaseManipulator.clearSeatArrangementRepository();
        databaseManipulator.clearCourseRepository();
        databaseManipulator.clearRoomRepository();
        databaseManipulator.clearUserRepository();
        this.seatArrangements.clear();
    }

    private List<SeatArrangementDto> addSomeSeatArrangements() {

        List<SeatArrangementDto> seatArrangementDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            seatArrangementDtos.add(EntityGenerator.createNewSeatArrangement(faker, userDto, courseDto, roomDto));
        }

        return seatArrangementDtos;

    }

    private void addSeatArrangementToDatabase() {
        List<SeatArrangementDto> repositorySeatArrangement = new ArrayList<>();
        for (SeatArrangementDto seatArrangementDto: this.seatArrangements) {
            repositorySeatArrangement.add(databaseManipulator.addSeatArrangement(seatArrangementDto));
        }

        this.seatArrangements = repositorySeatArrangement;
    }

    @Test
    public void addSeatArrangements() throws Exception{
        for (SeatArrangementDto seatArrangementDto: seatArrangements) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(seatArrangementDto))
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            SeatArrangementDto seatArrangementDtoFromContent = super.mapFromJson(content, SeatArrangementDto.class);

            assertEquals(seatArrangementDto.getUserId(), seatArrangementDtoFromContent.getUserId());
            assertEquals(seatArrangementDto.getName(), seatArrangementDtoFromContent.getName());
            assertEquals(seatArrangementDto.getCourseId(), seatArrangementDtoFromContent.getCourseId());
            assertEquals(seatArrangementDto.getSeatMap(), seatArrangementDtoFromContent.getSeatMap());
            assertNotNull(seatArrangementDtoFromContent.getId());
            seatArrangements.set(seatArrangements.indexOf(seatArrangementDto), seatArrangementDtoFromContent);
        }
    }


    @Test
    public void getOneSeatArrangement() throws Exception {
        addSeatArrangementToDatabase();

        for (SeatArrangementDto seatArrangementDto: seatArrangements) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + seatArrangementDto.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            SeatArrangementDto seatArrangementDtoFromDatabase = super.mapFromJson(content, SeatArrangementDto.class);


            assertEquals(seatArrangementDto, seatArrangementDtoFromDatabase);
        }
    }

    @Test
    public void getAllSeatArrangement() throws Exception {
        addSeatArrangementToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                .header("Authorization", "Bearer " + userDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        List<SeatArrangementDto> seatArrangementDtos = Arrays.asList(super.mapFromJson(content, SeatArrangementDto[].class));

        seatArrangementDtos.sort(Comparator.naturalOrder());
        seatArrangements.sort(Comparator.naturalOrder());


        for (int i= 0; i < seatArrangements.size(); i++) {
            assertEquals(seatArrangements.get(i), seatArrangementDtos.get(i));
        }
    }

    @Test
    public void deleteSeatArrangements() throws Exception {
        List<SeatArrangementDto> before = databaseManipulator.getSeatArrangements();
        addSeatArrangementToDatabase();

        for (SeatArrangementDto seatArrangementDto: seatArrangements) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(seatArrangementDto.getId())
                    .param("id", seatArrangementDto.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<SeatArrangementDto> after = databaseManipulator.getSeatArrangements();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }
}
