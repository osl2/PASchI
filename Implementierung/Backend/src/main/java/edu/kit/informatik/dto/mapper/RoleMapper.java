package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.model.Role;

import java.util.LinkedList;
import java.util.List;

public class RoleMapper implements IModelDtoMapper<Role, RoleDto> {

    @Override
    public RoleDto modelToDto(Role role) {
        return RoleDto.valueOf(role.toString());
    }

    @Override
    public List<RoleDto> modelToDto(List<Role> roles) {
        List<RoleDto> roleDtos = new LinkedList<>();
        roles.forEach(role -> roleDtos.add(modelToDto(role)));

        return roleDtos;
    }

    @Override
    public Role dtoToModel(RoleDto roleDto) {
        return Role.valueOf(roleDto.toString());
    }

    @Override
    public List<Role> dtoToModel(List<RoleDto> roleDtos) {
        List<Role> roles = new LinkedList<>();
        roleDtos.forEach(roleDto -> roles.add(dtoToModel(roleDto)));

        return roles;
    }
}