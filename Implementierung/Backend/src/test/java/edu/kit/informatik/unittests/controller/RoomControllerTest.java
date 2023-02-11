package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.dto.mapper.rooms.RoomMapper;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.model.User;
import edu.kit.informatik.repositories.RoomRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import static org.junit.Assert.assertEquals;

public class RoomControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/room";


    @Autowired
    private RoomMapper roomMapper;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;


    private List<RoomDto> rooms;

    @Before
    @Override
    public void setUp() {
        super.setUp();
        this.rooms = addSomeRooms();
    }

    @After
    @Override
    public void setDown() {
        this.roomRepository.deleteAll();
    }

    private List<RoomDto> addSomeRooms() {

        List<RoomDto> roomDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            roomDtos.add(getNewRoom(faker));
        }

        return roomDtos;
    }


    private void addRoomToDatabase() {
        List<RoomDto> repositoryUser = new ArrayList<>();
        for (RoomDto roomDto: this.rooms) {
            repositoryUser.add(roomMapper.modelToDto(this.roomRepository.save(roomMapper.dtoToModel(roomDto))));
        }

        assertEquals(rooms.size(), repositoryUser.size());
        for (int i= 0; i< rooms.size(); i++) {
            assertEquals(rooms.get(i).getName(), repositoryUser.get(i).getName());
            assertEquals(rooms.get(i).getUserId(), repositoryUser.get(i).getUserId());
            assertEquals(rooms.get(i).getRoomObjects(), repositoryUser.get(i).getRoomObjects());
        }

        this.rooms = repositoryUser;
    }

    private void deleteFromDataBase() {

        for (RoomDto roomDto: rooms) {
            if (roomDto.getId() != null) {
                this.roomRepository.deleteById(roomDto.getId());
            }
        }

        rooms.clear();
    }

    @Test
    public void addRooms() throws Exception {

        for (int i = 0; i< rooms.size(); i++) {

            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                            .content(super.mapToJson(rooms.get(i)))
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            RoomDto roomDto = super.mapFromJson(content, RoomDto.class);


            assertEquals(rooms.get(i).getName(), roomDto.getName());
            assertEquals(rooms.get(i).getUserId(), roomDto.getUserId());
            assertEquals(rooms.get(i).getRoomObjects(), roomDto.getRoomObjects());
            rooms.set(i, roomDto);
        }
        deleteFromDataBase();
    }


    @Test
    public void getOneRoom() throws Exception {
        addRoomToDatabase();

        for (RoomDto room: rooms) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + room.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            RoomDto roomDto = super.mapFromJson(content, RoomDto.class);


            assertEquals(roomDto, room);
        }

        deleteFromDataBase();
    }

    @Test
    public void getAllRooms() throws Exception {
        addRoomToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                //.accept(MediaType.APPLICATION_JSON_VALUE)
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        List<RoomDto> roomDtos = Arrays.asList(super.mapFromJson(content, RoomDto[].class));

        roomDtos.sort(Comparator.naturalOrder());
        rooms.sort(Comparator.naturalOrder());


        for (int i= 0; i < rooms.size(); i++) {
            assertEquals(rooms.get(i), roomDtos.get(i));
        }

        deleteFromDataBase();
    }

    @Test
    public void deleteRooms() throws Exception {
        List<RoomDto> before = getRoomFromDataBase();
        addRoomToDatabase();

        for (RoomDto roomDto: rooms) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(roomDto.getId()).param("id", roomDto.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<RoomDto> after = getRoomFromDataBase();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    private List<RoomDto> getRoomFromDataBase() {
        return roomMapper.modelToDto(this.roomRepository.findAll());
    }


    private RoomDto getNewRoom(Faker faker) {
        RoomDto roomDto = new RoomDto();

        roomDto.setName(faker.funnyName().name());
        User user = this.userRepository.save(userMapper.dtoToModel(getNewUser(faker)));
        roomDto.setUserId(user.getId());
        roomDto.setRoomObjects(new ArrayList<>());
        roomDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

        return roomDto;
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
        userDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

        return userDto;
    }
}
