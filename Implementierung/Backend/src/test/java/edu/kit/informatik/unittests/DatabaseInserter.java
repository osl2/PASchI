package edu.kit.informatik.unittests;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.dto.mapper.UserMapper;
import edu.kit.informatik.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public final class DatabaseInserter {

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserMapper userMapper;

    public UserDto addUserToDatabase(UserDto userDto) {
        UserDto newUserDto = new UserDto(userDto.getId(), userDto.getFirstName(), userDto.getLastName(),
                userDto.getEmail(), userDto.getPassword(), userDto.isAuth(), userDto.getToken(), userDto.getRole(), userDto.getCreatedAt(), userDto.getUpdatedAt());
        newUserDto.setPassword("{bcrypt}" + new BCryptPasswordEncoder().encode(userDto.getPassword()));
        newUserDto = userMapper.modelToDto(this.userRepository.save(userMapper.dtoToModel(newUserDto)));
        newUserDto.setPassword(userDto.getPassword());
        return newUserDto;
    }

}
