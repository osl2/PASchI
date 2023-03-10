package edu.kit.informatik.unittests;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.dto.mapper.interactions.CategoryMapper;
import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.mapper.interactions.RatedCategoryMapper;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import edu.kit.informatik.repositories.ParticipantRepository;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


@Component
public final class DatabaseManipulator {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ParticipantRepository participantRepository;
    @Autowired
    private CategoryBaseRepository<RatedCategory> categoryRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ParticipantMapper participantMapper;
    @Autowired
    private CategoryMapper categoryMapper;
    @Autowired
    private RatedCategoryMapper ratedCategoryMapper;

    public UserDto addUser(UserDto userDto) {
        UserDto newUserDto = new UserDto(userDto.getId(), userDto.getFirstName(), userDto.getLastName(),
                userDto.getEmail(), userDto.getPassword(), userDto.isAuth(), userDto.getToken(), userDto.getRole(), userDto.getCreatedAt(), userDto.getUpdatedAt());
        newUserDto.setPassword("{bcrypt}" + new BCryptPasswordEncoder().encode(userDto.getPassword()));
        newUserDto = userMapper.modelToDto(this.userRepository.save(userMapper.dtoToModel(newUserDto)));
        newUserDto.setPassword(userDto.getPassword());
        return newUserDto;
    }

    public ParticipantDto addParticipant(ParticipantDto participantDto) {
        return participantMapper.modelToDto(this.participantRepository.save(participantMapper.dtoToModel(participantDto)));
    }

    public RatedCategoryDto addCategory(RatedCategoryDto ratedCategoryDto) {
        return ratedCategoryMapper.modelToDto(this.categoryRepository.save(ratedCategoryMapper.dtoToModel(ratedCategoryDto)));
    }

    public List<UserDto> getUsers() {
        return userMapper.modelToDto(this.userRepository.findAll());
    }
    
    public List<ParticipantDto> getParticipants() {
        return participantMapper.modelToDto(this.participantRepository.findAll());
    }

    public List<CategoryDto> getCategories() {

        List<RatedCategory> categoryList = categoryRepository.findAll();
        List<CategoryDto> categoryDtoList = new ArrayList<>();

        for (RatedCategory ratedCategory: categoryList) {
            categoryDtoList.add(categoryMapper.modelToDto(ratedCategory));
        }

        return categoryDtoList;
    }

    public void clearUserRepository() {
        this.userRepository.deleteAll();
    }

    public void clearParticipantRepository() {
        this.participantRepository.deleteAll();
    }

    public void clearCategoryRepository() {
        this.categoryRepository.deleteAll();
    }


}
