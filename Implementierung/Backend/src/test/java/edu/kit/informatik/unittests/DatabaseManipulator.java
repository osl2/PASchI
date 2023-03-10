package edu.kit.informatik.unittests;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.dto.mapper.courses.CourseMapper;
import edu.kit.informatik.dto.mapper.courses.SessionMapper;
import edu.kit.informatik.dto.mapper.interactions.CategoryMapper;
import edu.kit.informatik.dto.mapper.interactions.ParticipantMapper;
import edu.kit.informatik.dto.mapper.interactions.RatedCategoryMapper;
import edu.kit.informatik.dto.mapper.rooms.RoomMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.dto.userdata.interactions.CategoryDto;
import edu.kit.informatik.dto.userdata.interactions.ParticipantDto;
import edu.kit.informatik.dto.userdata.interactions.RatedCategoryDto;
import edu.kit.informatik.dto.userdata.rooms.RoomDto;
import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.repositories.CategoryBaseRepository;
import edu.kit.informatik.repositories.CourseRepository;
import edu.kit.informatik.repositories.ParticipantRepository;
import edu.kit.informatik.repositories.RoomRepository;
import edu.kit.informatik.repositories.SessionRepository;
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
    private CourseRepository courseRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ParticipantMapper participantMapper;
    @Autowired
    private CategoryMapper categoryMapper;
    @Autowired
    private RatedCategoryMapper ratedCategoryMapper;
    @Autowired
    private CourseMapper courseMapper;
    @Autowired
    private SessionMapper sessionMapper;
    @Autowired
    private RoomMapper roomMapper;

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

    public CourseDto addCourse(CourseDto courseDto) {
        return courseMapper.modelToDto(this.courseRepository.save(courseMapper.dtoToModel(courseDto)));
    }

    public SessionDto addSession(SessionDto sessionDto) {
        return sessionMapper.modelToDto(this.sessionRepository.save(sessionMapper.dtoToModel(sessionDto)));
    }
    public RoomDto addRoom(RoomDto roomDto) {
        return roomMapper.modelToDto(this.roomRepository.save(roomMapper.dtoToModel(roomDto)));
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

    public List<CourseDto> getCourses() {
        return courseMapper.modelToDto(this.courseRepository.findAll());
    }

    public List<SessionDto> getSessions() {
        return sessionMapper.modelToDto(this.sessionRepository.findAll());
    }

    public List<RoomDto> getRooms() {
        return roomMapper.modelToDto(this.roomRepository.findAll());
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

    public void clearCourseRepository() {
        this.courseRepository.deleteAll();
    }

    public void clearSessionRepository() {
        this.sessionRepository.deleteAll();
    }

    public void clearRoomRepository() {
        this.roomRepository.deleteAll();
    }

}
