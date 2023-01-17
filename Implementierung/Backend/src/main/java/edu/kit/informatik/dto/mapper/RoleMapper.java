package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.RoleDto;
import edu.kit.informatik.model.Role;

import java.util.List;

public class RoleMapper implements IModelDtoMapper<Role, RoleDto> {

    @Override
    public RoleDto modelToDto(Role role) {
        return null;
    }

    @Override
    public List<RoleDto> modelToDto(List<Role> roles) {
        return null;
    }

    @Override
    public Role dtoToModel(RoleDto roleDto) {
        return null;
    }

    @Override
    public List<Role> dtoToModel(List<RoleDto> roleDtos) {
        return null;
    }
}
