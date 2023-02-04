package edu.kit.informatik.unittests.controller;


import com.github.javafaker.Faker;
import edu.kit.informatik.dto.mapper.courses.CourseMapper;
import edu.kit.informatik.dto.mapper.courses.SeatArrangementMapper;
import edu.kit.informatik.dto.mapper.rooms.RoomMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.model.userdata.rooms.Room;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.RoomRepository;
import edu.kit.informatik.repositories.SeatArrangementRepository;
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
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class SeatArrangementControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/seatarrangement";

    @Autowired
    private SeatArrangementMapper seatArrangementMapper;

    @Autowired
    private SeatArrangementRepository seatArrangementRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMapper roomMapper;


    private List<SeatArrangementDto> seatArrangements;

    @Before
    @Override
    public void setUp() {
        super.setUp();
        this.seatArrangements = addSomeSeatArrangements();
    }

    private List<SeatArrangementDto> addSomeSeatArrangements() {

        List<SeatArrangementDto> seatArrangementDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            seatArrangementDtos.add(getNewSeatArrangement(faker));
        }

        return seatArrangementDtos;

    }

    private void deleteFromDataBase() {

        for (SeatArrangementDto seatArrangementDto: seatArrangements) {
            if (seatArrangementDto.getId() != null) {
                this.seatArrangementRepository.deleteById(seatArrangementDto.getId());
            }
        }

        seatArrangements.clear();
    }

    private void addSeatArrangementToDatabase() {
        List<SeatArrangementDto> repositorySeatArrangement = new ArrayList<>();
        for (SeatArrangementDto seatArrangementDto: this.seatArrangements) {
            repositorySeatArrangement.add(seatArrangementMapper.modelToDto(this.seatArrangementRepository.save(seatArrangementMapper.dtoToModel(seatArrangementDto))));
        }

        assertEquals(seatArrangements.size(), repositorySeatArrangement.size());
        for (int i= 0; i< seatArrangements.size(); i++) {
            assertEquals(seatArrangements.get(i).getUserId(), repositorySeatArrangement.get(i).getUserId());
            assertEquals(seatArrangements.get(i).getName(), repositorySeatArrangement.get(i).getName());
            assertEquals(seatArrangements.get(i).getCourseId(), repositorySeatArrangement.get(i).getCourseId());
            assertEquals(seatArrangements.get(i).getSeatMap(), repositorySeatArrangement.get(i).getSeatMap());
            assertNotNull(repositorySeatArrangement.get(i).getId());
        }

        this.seatArrangements = repositorySeatArrangement;
    }

    @Test
    public void addSeatArrangements() throws Exception{
        for (SeatArrangementDto seatArrangementDto: seatArrangements) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                            .content(super.mapToJson(seatArrangementDto))
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
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
        deleteFromDataBase();
    }


    @Test
    public void getOneSeatArrangement() throws Exception {
        addSeatArrangementToDatabase();

        for (SeatArrangementDto seatArrangementDto: seatArrangements) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + seatArrangementDto.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            SeatArrangementDto seatArrangementDtoFromDatabase = super.mapFromJson(content, SeatArrangementDto.class);


            assertEquals(seatArrangementDto, seatArrangementDtoFromDatabase);
        }

        deleteFromDataBase();
    }

    @Test
    public void getAllSeatArrangement() throws Exception {
        addSeatArrangementToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                //.accept(MediaType.APPLICATION_JSON_VALUE)
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

        deleteFromDataBase();
    }

    @Test
    public void deleteSeatArrangements() throws Exception {
        List<SeatArrangementDto> before = getSeatArrangementsFromDataBase();
        addSeatArrangementToDatabase();

        for (SeatArrangementDto seatArrangementDto: seatArrangements) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(seatArrangementDto.getId()).param("id", seatArrangementDto.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<SeatArrangementDto> after = getSeatArrangementsFromDataBase();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    private List<SeatArrangementDto> getSeatArrangementsFromDataBase() {
        return seatArrangementMapper.modelToDto(this.seatArrangementRepository.findAll());
    }


    private SeatArrangementDto getNewSeatArrangement(Faker faker) {

        SeatArrangementDto seatArrangementDto = new SeatArrangementDto();

        String name = faker.team().name();

        seatArrangementDto.setName(name + " " + faker.number().randomDigit());

        seatArrangementDto.setUserId("4ccc614c-fda8-471d-b444-c70ca756cf0b");
        seatArrangementDto.setSeatMap(new HashMap<>());


        Course course = courseRepository.save(courseMapper.dtoToModel(getNewCourse(faker)));
        seatArrangementDto.setCourseId(course.getId());

        Room room = roomRepository.save(roomMapper.dtoToModel(getNewRoom(faker)));
        seatArrangementDto.setRoomId(room.getId());

        return seatArrangementDto;
    }

    private CourseDto getNewCourse(Faker faker) {
        CourseDto courseDto = new CourseDto();

        String name = faker.team().name();

        courseDto.setName(name + " " + faker.number().randomDigit());
        courseDto.setSubject(name);
        courseDto.setUserId("4ccc614c-fda8-471d-b444-c70ca756cf0b");

        return courseDto;
    }

    private RoomDto getNewRoom(Faker faker) {
        RoomDto roomDto = new RoomDto();

        roomDto.setName(String.valueOf(faker.number().randomDigit()));
        roomDto.setUserId("4ccc614c-fda8-471d-b444-c70ca756cf0b");
        roomDto.setRoomObjects(new ArrayList<>());

        return roomDto;
    }
}
