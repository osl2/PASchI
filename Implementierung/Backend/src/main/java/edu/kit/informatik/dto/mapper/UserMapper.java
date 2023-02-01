package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.model.Role;
import edu.kit.informatik.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserMapper implements IModelDtoMapper<User, UserDto, UserDto> {

    private final RoleMapper roleMapper;

    @Autowired
    public UserMapper(RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
    }

    @Override
    public UserDto modelToDto(User user) {
        RoleDto roleDto = roleMapper.modelToDto(user.getRole());

        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.isAuth(),
                null,
                roleDto);
    }

    @Override
    public List<UserDto> modelToDto(List<User> users) {
        List<UserDto> userDtos = new ArrayList<>();
        users.forEach(user -> userDtos.add(modelToDto(user)));

        return userDtos;
    }

    @Override
    public User dtoToModel(UserDto userDto) {
        Role role = roleMapper.dtoToModel(userDto.getRole());

        return new User(userDto.getFirstName(), userDto.getLastName(), userDto.getEmail(), userDto.getPassword(),
                userDto.isAuth(), role);
    }

    @Override
    public List<User> dtoToModel(List<UserDto> userDtos) {
        List<User> users = new ArrayList<>();
        userDtos.forEach(userDto -> users.add(dtoToModel(userDto)));

        return users;
    }
}
