package edu.kit.informatik.unittests.controller;

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
        userDto.setPassword("{bcrypt}" + new BCryptPasswordEncoder().encode(userDto.getPassword()));
        return userMapper.modelToDto(this.userRepository.save(userMapper.dtoToModel(userDto)));
    }

}
