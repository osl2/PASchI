package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.UserDto;
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

public class RoomControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/room";

    @Autowired
    DatabaseManipulator databaseManipulator;

    private List<RoomDto> rooms;
    private UserDto userDto;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        userDto = super.addAndLogin(EntityGenerator.createNewUser(new Faker(new Locale("de"))));
        this.rooms = addSomeRooms();
    }

    @After
    @Override
    public void setDown() {
        databaseManipulator.clearRoomRepository();
        databaseManipulator.clearUserRepository();
        this.rooms.clear();
    }

    private List<RoomDto> addSomeRooms() {

        List<RoomDto> roomDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            roomDtos.add(EntityGenerator.createNewRoom(faker, userDto));
        }

        return roomDtos;
    }


    private void addRoomToDatabase() {
        List<RoomDto> repositoryUser = new ArrayList<>();
        for (RoomDto roomDto: this.rooms) {
            repositoryUser.add(databaseManipulator.addRoom(roomDto));
        }

        this.rooms = repositoryUser;
    }

    @Test
    public void addRooms() throws Exception {

        for (int i = 0; i< rooms.size(); i++) {

            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(rooms.get(i)))
                    .header("Authorization", "Bearer " + userDto.getToken())
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
    }


    @Test
    public void getOneRoom() throws Exception {
        addRoomToDatabase();

        for (RoomDto room: rooms) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + room.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            RoomDto roomDto = super.mapFromJson(content, RoomDto.class);


            assertEquals(roomDto, room);
        }
    }

    @Test
    public void getAllRooms() throws Exception {
        addRoomToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                .header("Authorization", "Bearer " + userDto.getToken())
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
    }

    @Test
    public void deleteRooms() throws Exception {
        List<RoomDto> before = databaseManipulator.getRooms();
        addRoomToDatabase();

        for (RoomDto roomDto: rooms) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL)
                    .param("id", roomDto.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<RoomDto> after = databaseManipulator.getRooms();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }
}
