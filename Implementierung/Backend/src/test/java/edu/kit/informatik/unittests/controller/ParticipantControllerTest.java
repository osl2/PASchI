package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantTypeDto;
import edu.kit.informatik.repositories.ParticipantRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import static org.junit.Assert.assertEquals;

public class ParticipantControllerTest extends AbstractTest {


    @Autowired
    private ParticipantMapper participantMapper;

    @Autowired
    private ParticipantRepository participantRepository;

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

    @Test
    public void addParticipantToDatabase() {
        List<ParticipantDto> repositoryUser = new ArrayList<>();
        for (ParticipantDto participantDto: this.participants) {
            repositoryUser.add(participantMapper.modelToDto(this.participantRepository.save(participantMapper.dtoToModel(participantDto))));
        }

        assertEquals(participants.size(), repositoryUser.size());
        for (int i= 0; i< participants.size(); i++) {
            assertEquals(participants.get(i).getFirstName(), repositoryUser.get(i).getFirstName());
            assertEquals(participants.get(i).getLastName(), repositoryUser.get(i).getLastName());
            assertEquals(participants.get(i).getUserId(), repositoryUser.get(i).getUserId());
        }

        this.participants = repositoryUser;
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
