package edu.kit.informatik.unittests;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantTypeDto;
import edu.kit.informatik.dto.userdata.interactions.QualityDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;

public final class EntityGenerator {

    public static UserDto createNewUser(Faker faker) {
        UserDto userDto = new UserDto();
        userDto.setRole(RoleDto.USER);

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();

        userDto.setEmail(firstName + "." + lastName + "@kit.edu");
        userDto.setFirstName(firstName);
        userDto.setLastName(lastName);
        userDto.setPassword(faker.crypto().md5());
        userDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));
        userDto.setAuth(true);

        return userDto;
    }

    public static RatedCategoryDto createNewCategory(Faker faker, UserDto userDto) {

        RatedCategoryDto categoryDto = new RatedCategoryDto();

        String name = faker.team().name();

        categoryDto.setName(name + " " + faker.number().randomDigit());
        categoryDto.setUserId(userDto.getId());
        categoryDto.setQuality(QualityDto.FOUR_STAR);
        categoryDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

        return categoryDto;
    }

    public static ParticipantDto createNewParticipant(Faker faker, UserDto userDto) {
        ParticipantDto participantDto = new ParticipantDto();

        participantDto.setParticipantType(ParticipantTypeDto.Student);

        participantDto.setUserId(userDto.getId());
        participantDto.setFirstName(faker.name().firstName());
        participantDto.setLastName(faker.name().lastName());
        participantDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));
        participantDto.setVisible(true);

        return participantDto;
    }

    public static CourseDto createNewCourse(Faker faker, UserDto userDto) {

        CourseDto courseDto = new CourseDto();

        String name = faker.team().name();

        courseDto.setName(name + " " + faker.number().randomDigit());
        courseDto.setSubject(name);
        courseDto.setUserId(userDto.getId());
        courseDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

        return courseDto;
    }

    public static SessionDto createNewSession(Faker faker, CourseDto courseDto, UserDto userDto) {
        SessionDto sessionDto = new SessionDto();

        sessionDto.setName(faker.funnyName().name());
        sessionDto.setUserId(userDto.getId());
        sessionDto.setCourseId(courseDto.getId());
        sessionDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

        sessionDto.setDate(Timestamp.from(Instant.now()).toString());

        return sessionDto;
    }

    public static RoomDto createNewRoom(Faker faker, UserDto userDto) {
        RoomDto roomDto = new RoomDto();

        roomDto.setName(faker.funnyName().name());
        roomDto.setUserId(userDto.getId());
        roomDto.setRoomObjects(new ArrayList<>());
        roomDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

        return roomDto;
    }

    public static SeatArrangementDto createNewSeatArrangement(Faker faker, UserDto userDto, CourseDto courseDto,
                                                                RoomDto roomDto) {

        SeatArrangementDto seatArrangementDto = new SeatArrangementDto();

        String name = faker.team().name();

        seatArrangementDto.setName(name + " " + faker.number().randomDigit());

        seatArrangementDto.setUserId(userDto.getId());
        seatArrangementDto.setSeatMap(new HashMap<>());

        seatArrangementDto.setCourseId(courseDto.getId());

        seatArrangementDto.setRoomId(roomDto.getId());
        seatArrangementDto.setCreatedAt(Timestamp.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)));

        return seatArrangementDto;
    }
}
