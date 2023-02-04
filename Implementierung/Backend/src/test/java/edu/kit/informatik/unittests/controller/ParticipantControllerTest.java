package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantTypeDto;
import edu.kit.informatik.repositories.ParticipantRepository;
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

public class ParticipantControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/participant";


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


    private void addParticipantToDatabase() {
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

    private void deleteFromDataBase() {

        for (ParticipantDto participantDto: participants) {
            if (participantDto.getId() != null) {
                this.participantRepository.deleteById(participantDto.getId());
            }
        }

        participants.clear();
    }

    @Test
    public void addParticipants() throws Exception {

        for (int i = 0; i< participants.size(); i++) {
            //System.out.println(participants.get(i).getParticipantType());
            //System.out.println(super.mapToJson(participants.get(i)));

            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                            .content(super.mapToJson(participants.get(i)))
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            ParticipantDto participantDto = super.mapFromJson(content, ParticipantDto.class);


            assertEquals(participants.get(i).getFirstName(), participantDto.getFirstName());
            assertEquals(participants.get(i).getLastName(), participantDto.getLastName());
            assertEquals(participants.get(i).getUserId(), participantDto.getUserId());
            participants.set(i, participantDto);
        }
        deleteFromDataBase();
    }


    @Test
    public void getOneParticipant() throws Exception {
        addParticipantToDatabase();

        for (ParticipantDto participant: participants) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + participant.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            ParticipantDto participantDto = super.mapFromJson(content, ParticipantDto.class);


            assertEquals(participantDto, participant);
        }

        deleteFromDataBase();
    }

    @Test
    public void getAllParticipants() throws Exception {
        addParticipantToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                //.accept(MediaType.APPLICATION_JSON_VALUE)
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        System.out.println(content);
        List<ParticipantDto> participantDtos = Arrays.asList(super.mapFromJson(content, ParticipantDto[].class));

        participantDtos.sort(Comparator.naturalOrder());
        participants.sort(Comparator.naturalOrder());


        for (int i= 0; i < participants.size(); i++) {
            assertEquals(participants.get(i), participantDtos.get(i));
        }

        deleteFromDataBase();
    }

    @Test
    public void deleteParticipants() throws Exception {
        List<ParticipantDto> before = getUserFromDataBase();
        addParticipantToDatabase();

        for (ParticipantDto participantDto: participants) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(participantDto.getId()).param("id", participantDto.getId())
                    //.accept(MediaType.APPLICATION_JSON_VALUE)
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }
        List<ParticipantDto> after = getUserFromDataBase();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals(before.get(i), after.get(i));
        }

    }

    private List<ParticipantDto> getUserFromDataBase() {
        return participantMapper.modelToDto(this.participantRepository.findAll());
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
