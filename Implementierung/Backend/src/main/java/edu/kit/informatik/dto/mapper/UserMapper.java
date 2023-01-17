package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.model.Role;
import edu.kit.informatik.model.User;
import edu.kit.informatik.repositories.UserRepository;

import java.util.LinkedList;
import java.util.List;

public class UserMapper implements IModelDtoMapper<User, UserDto> {

    private final UserRepository userRepository;

    public UserMapper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDto modelToDto(User user) {
        IModelDtoMapper<Role, RoleDto> roleMapper = new RoleMapper();
        RoleDto role = roleMapper.modelToDto(user.getRole());

        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                user.isAuth(),
                null,
                role);
    }

    @Override
    public List<UserDto> modelToDto(List<User> users) {
        List<UserDto> userDtos = new LinkedList<>();
        users.forEach(user -> userDtos.add(modelToDto(user)));

        return userDtos;
    }

    @Override
    public User dtoToModel(UserDto userDto) {
        IModelDtoMapper<Role, RoleDto> roleMapper = new RoleMapper();
        Role role = roleMapper.dtoToModel(userDto.getRole());

        return userRepository.findUserById(userDto.getId()).orElseGet(() -> new User(
                userDto.getFirstName(),
                userDto.getLastName(),
                userDto.getEmail(),
                userDto.getPassword(),
                userDto.isAuth(),
                role));
    }

    @Override
    public List<User> dtoToModel(List<UserDto> userDtos) {
        List<User> users = new LinkedList<>();
        userDtos.forEach(userDto -> users.add(dtoToModel(userDto)));

        return users;
    }
}
