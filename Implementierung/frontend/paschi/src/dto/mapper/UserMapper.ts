import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {User} from "@/model/User";
import {UserDto} from "@/dto/UserDto";
import {RoleMapper} from "@/dto/mapper/RoleMapper";
import {useUserStore} from "@/store/UserStore";

export class UserMapper implements IModelDtoMapper<User, UserDto> {

  private static mapper: UserMapper = new UserMapper();
  private roleMapper: RoleMapper = new RoleMapper();
  private userStore = useUserStore();

  private constructor() {
  }

  static getMapper(): UserMapper {
    return UserMapper.mapper;
  }

  modelToDto(user: User): UserDto {
    let id: string | undefined;
    if (user.hasId()) {
      id = user.getId;
    } else {
      id = "";
    }

    return new UserDto(
      id,
      user.createdAt,
      user.updatedAt,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.auth,
      this.roleMapper.modelToDto(user.role),
      user.token
    );
  }

  dtoToModel(userDto: UserDto): User {
    return new User(
      userDto.id,
      userDto.firstName,
      userDto.lastName,
      userDto.email,
      userDto.password,
      userDto.auth,
      this.roleMapper.dtoToModel(userDto.role),
      userDto.token
    );
  }
}
