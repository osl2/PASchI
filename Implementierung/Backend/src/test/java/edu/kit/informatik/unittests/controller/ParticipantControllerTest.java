package edu.kit.informatik.unittests.controller;

import com.github.javafaker.Faker;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.repositories.ParticipantRepository;
import edu.kit.informatik.repositories.UserRepository;
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

public class ParticipantControllerTest extends AbstractTest {

    private static final String BASE_URL = "/api/participant";


    @Autowired
    private ParticipantMapper participantMapper;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private UserRepository userRepository;

    private List<ParticipantDto> participants;

    private UserDto userDto;

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        userDto = super.addAndLogin(EntityGenerator.createNewUser(new Faker(new Locale("de"))));
        this.participants = addSomeParticipants();
    }

    @After
    @Override
    public void setDown() {
        this.participantRepository.deleteAll();
        this.userRepository.deleteAll();
        this.participants.clear();
    }

    private List<ParticipantDto> addSomeParticipants() {

        List<ParticipantDto> participantsDtos = new ArrayList<>();
        Faker faker = new Faker(new Locale("de"));

        for (int i = 0; i < 10; i++) {
            participantsDtos.add(EntityGenerator.createNewParticipant(faker, userDto));
        }

        return participantsDtos;
    }


    private void addParticipantToDatabase() {
        List<ParticipantDto> repositoryParticipant = new ArrayList<>();
        for (ParticipantDto participantDto: this.participants) {
            repositoryParticipant.add(participantMapper.modelToDto(this.participantRepository.save(participantMapper.dtoToModel(participantDto))));
        }

        assertEquals(participants.size(), repositoryParticipant.size());
        for (int i= 0; i< participants.size(); i++) {
            assertEquals(participants.get(i).getFirstName(), repositoryParticipant.get(i).getFirstName());
            assertEquals(participants.get(i).getLastName(), repositoryParticipant.get(i).getLastName());
            assertEquals(participants.get(i).getUserId(), repositoryParticipant.get(i).getUserId());
        }

        this.participants = repositoryParticipant;
    }

    @Test
    public void addParticipants() throws Exception {

        for (int i = 0; i< participants.size(); i++) {

            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(BASE_URL).contentType(MediaType.APPLICATION_JSON)
                    .content(super.mapToJson(participants.get(i)))
                    .header("Authorization", "Bearer " + userDto.getToken())
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
    }


    @Test
    public void getOneParticipant() throws Exception {
        addParticipantToDatabase();

        for (ParticipantDto participant: participants) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/" + participant.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

            ParticipantDto participantDto = super.mapFromJson(content, ParticipantDto.class);


            assertEquals(participantDto, participant);
        }
    }

    @Test
    public void getAllParticipants() throws Exception {
        addParticipantToDatabase();

        MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                .header("Authorization", "Bearer " + userDto.getToken())
        ).andReturn();

        int status = mvcResult.getResponse().getStatus();
        assertEquals(200, status);
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);

        List<ParticipantDto> participantDtos = Arrays.asList(super.mapFromJson(content, ParticipantDto[].class));

        participantDtos.sort(Comparator.naturalOrder());
        participants.sort(Comparator.naturalOrder());


        for (int i= 0; i < participants.size(); i++) {
            assertEquals(participants.get(i), participantDtos.get(i));
        }
    }

    @Test
    public void deleteParticipants() throws Exception {
        addParticipantToDatabase();
        List<ParticipantDto> before = getParticipantsFromDataBase();


        for (ParticipantDto participantDto: participants) {
            MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(BASE_URL).content(participantDto.getId())
                    .param("id", participantDto.getId())
                    .header("Authorization", "Bearer " + userDto.getToken())
            ).andReturn();

            int status = mvcResult.getResponse().getStatus();
            assertEquals(200, status);
        }

        List<ParticipantDto> after = getParticipantsFromDataBase();

        assertEquals(before.size(), after.size());

        for (int i = 0; i< before.size(); i++) {
            assertEquals("Deleted", after.get(i).getFirstName());
            assertEquals("User", after.get(i).getLastName());
            before.get(i).setFirstName(after.get(i).getFirstName());
            before.get(i).setLastName(after.get(i).getLastName());
            before.get(i).setVisible(false);
            assertEquals(before.get(i), after.get(i));
        }

    }

    private List<ParticipantDto> getParticipantsFromDataBase() {
        return participantMapper.modelToDto(this.participantRepository.findAll());
    }


}
