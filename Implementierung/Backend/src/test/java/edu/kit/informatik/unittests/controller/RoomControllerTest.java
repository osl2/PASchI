package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.userdata.rooms.ChairDto;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.dto.userdata.rooms.RoomObjectDto;
import edu.kit.informatik.dto.userdata.rooms.TableDto;
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

    private List<ChairDto> getSomeChairs() {
        List<ChairDto> chairDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 1; i++) {
            chairDtos.add(EntityGenerator.createNewChairDto(faker, userDto));
        }

        return chairDtos;
    }

    private List<TableDto> getSomeTables() {
        List<TableDto> tableDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 1; i++) {
            tableDtos.add(EntityGenerator.createNewTableDto(faker, userDto));
        }
        return tableDtos;
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

    @Test
    public void updateRoom() throws Exception {
        addRoomToDatabase();

        RoomDto roomDto =  rooms.get(0);

        List<RoomObjectDto> objectDtos = new ArrayList<>();
        objectDtos.addAll(getSomeTables());
        objectDtos.addAll(getSomeChairs());
        roomDto.setRoomObjects(objectDtos);

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                .content(super.mapToJson(roomDto))
                .header("Authorization", "Bearer " + userDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);

        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        RoomDto repoDto = super.mapFromJson(content, RoomDto.class);
        assertEquals(roomDto.getName(), repoDto.getName());
        assertEquals(roomDto.getCreatedAt(), repoDto.getCreatedAt());
        assertEquals(roomDto.getRoomObjects().size(), repoDto.getRoomObjects().size());
        for (int i = 0; i < roomDto.getRoomObjects().size(); i++) {

            if (roomDto.getRoomObjects().get(i) instanceof ChairDto chairDto) {
                ChairDto repoChairDto = (ChairDto) repoDto.getRoomObjects().get(i);
                assertEquals(chairDto.getUserId(), repoChairDto.getPosition().getUserId());
                assertEquals(chairDto.getCreatedAt(), repoChairDto.getPosition().getCreatedAt());

                assertEquals(chairDto.getPosition().getXCoordinate(), repoChairDto.getPosition().getXCoordinate(), 0);
                assertEquals(chairDto.getPosition().getYCoordinate(), repoChairDto.getPosition().getYCoordinate(), 0);
                assertEquals(chairDto.getPosition().getOrientation(), repoChairDto.getPosition().getOrientation(), 0);
                assertEquals(chairDto.getPosition().getUserId(), repoChairDto.getPosition().getUserId());
                assertEquals(chairDto.getPosition().getCreatedAt(), repoChairDto.getPosition().getCreatedAt());
            } else if (roomDto.getRoomObjects().get(i) instanceof TableDto tableDto) {
                TableDto repoTableDto = (TableDto) repoDto.getRoomObjects().get(i);
                assertEquals(tableDto.getUserId(), repoTableDto.getPosition().getUserId());
                assertEquals(tableDto.getCreatedAt(), repoTableDto.getPosition().getCreatedAt());
                assertEquals(tableDto.getLength(), repoTableDto.getLength(), 0);
                assertEquals(tableDto.getWidth(), repoTableDto.getWidth(), 0);

                assertEquals(tableDto.getPosition().getXCoordinate(), repoTableDto.getPosition().getXCoordinate(), 0);
                assertEquals(tableDto.getPosition().getYCoordinate(), repoTableDto.getPosition().getYCoordinate(), 0);
                assertEquals(tableDto.getPosition().getOrientation(), repoTableDto.getPosition().getOrientation(), 0);
                assertEquals(tableDto.getPosition().getUserId(), repoTableDto.getPosition().getUserId());
                assertEquals(tableDto.getPosition().getCreatedAt(), repoTableDto.getPosition().getCreatedAt());
            }
        }
        assertEquals(roomDto.getName(), roomDto.getName());

    }
}
