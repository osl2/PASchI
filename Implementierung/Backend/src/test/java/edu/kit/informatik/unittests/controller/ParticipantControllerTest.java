package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantTypeDto;
import edu.kit.informatik.service.ParticipantService;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class ParticipantControllerTest extends AbstractTest {


    @Autowired
    private ParticipantMapper participantMapper;

    @Autowired
    private ParticipantService participantService;

    private List<ParticipantDto> participants;

    @Before
    @Override
    public void setUp() {
        super.setUp();
        this.participants = addSomeParticipants();
    }

    private List<ParticipantDto> addSomeParticipants() {

        List<ParticipantDto> participantsDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            participantsDtos.add(getNewParticipant(faker));
        }

        return participantsDtos;
    }


    private ParticipantDto getNewParticipant(Faker faker) {
        ParticipantDto participantDto = new ParticipantDto();

        participantDto.setParticipantType(ParticipantTypeDto.Student);
        participantDto.setUserId("4ccc614c-fda8-471d-b444-c70ca756cf0b");
        participantDto.setFirstName(faker.name().firstName());
        participantDto.setLastName(faker.name().lastName());

        return participantDto;
    }


}
