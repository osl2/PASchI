package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.model.Role;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoleMapper implements IModelDtoMapper<Role, RoleDto, RoleDto> {

    @Override
    public RoleDto modelToDto(Role role) {
        return RoleDto.valueOf(role.toString());
    }

    @Override
    public List<RoleDto> modelToDto(List<Role> roles) {
        List<RoleDto> roleDtos = new ArrayList<>();
        roles.forEach(role -> roleDtos.add(modelToDto(role)));

        return roleDtos;
    }

    @Override
    public Role dtoToModel(RoleDto roleDto) {
        return Role.valueOf(roleDto.toString().toUpperCase());
    }

    @Override
    public List<Role> dtoToModel(List<RoleDto> roleDtos) {
        List<Role> roles = new ArrayList<>();
        roleDtos.forEach(roleDto -> roles.add(dtoToModel(roleDto)));

        return roles;
    }
}
