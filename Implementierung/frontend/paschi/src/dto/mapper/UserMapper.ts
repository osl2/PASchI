import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {User} from "@/model/User";
import {UserDto} from "@/dto/UserDto";
import {RoleMapper} from "@/dto/mapper/RoleMapper";
import {useUserStore} from "@/store/UserStore";

export class UserMapper implements IModelDtoMapper<User, UserDto> {

  roleMapper: RoleMapper = new RoleMapper();
  userStore = useUserStore();

  modelToDto(user: User): UserDto {
    let id: string | undefined;
    if (user.hasId()) {
      id = user.getId;
    } else {
      id = "";
    }

    return new UserDto(
      id,
      user.firstName,
      user.lastName,
      user.email,
      "",
      user.auth,
      this.roleMapper.modelToDto(user.role),
      user.token
    );
  }

  dtoToModel(userDto: UserDto): User {
    return new User(
      userDto.id,
      this.userStore.getNextId(),
      userDto.firstName,
      userDto.lastName,
      userDto.email,
      userDto.auth,
      this.roleMapper.dtoToModel(userDto.role),
      userDto.token
      );
  }
}
