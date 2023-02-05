import {BaseService} from "@/service/BaseService";
import {User} from "@/model/User";
import {UserDto} from "@/dto/UserDto";

const USER_BASE_URL: string = "";

export class UserService extends BaseService<User, UserDto> {

  constructor() {
    super(UserMapper.getMapper());
  }

  add(user: User) {
  }

  update(user: User) {
  }

  getById(id: string): User {
  }

  getAll(): User[] {
  }

  delete(id: string) {
  }

  // TODO: login
  login(email: string, password: string)/*: User*/ {

  }
}
