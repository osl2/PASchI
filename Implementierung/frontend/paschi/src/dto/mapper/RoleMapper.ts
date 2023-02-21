import {Role} from "@/model/Role";
import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {RoleDto} from "@/dto/RoleDto";

export class RoleMapper implements IModelDtoMapper<Role, RoleDto> {

  modelToDto(role: Role): RoleDto {
    if (role.valueOf() == Role.USER.valueOf()) {
      return RoleDto.USER;
    }
    return RoleDto.ADMIN;
  }

  dtoToModel(roleDto: RoleDto): Role {
    if (roleDto.valueOf() == RoleDto.USER.valueOf()) {
      return Role.USER;
    }
    return Role.ADMIN;
  }
}
