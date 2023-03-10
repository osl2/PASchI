package edu.kit.informatik.unittests;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.userdata.interactions.QualityDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

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

}
