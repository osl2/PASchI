package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.UserDto;
import edu.kit.informatik.model.User;

import java.util.List;

public class UserMapper implements IModelDtoMapper<User, UserDto> {

    @Override
    public UserDto modelToDto(User user) {
        return null;
    }

    @Override
    public List<UserDto> modelToDto(List<User> users) {
        return null;
    }

    @Override
    public User dtoToModel(UserDto userDto) {
        return null;
    }

    @Override
    public List<User> dtoToModel(List<UserDto> userDtos) {
        return null;
    }
}
