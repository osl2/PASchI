import {BaseService} from "@/service/BaseService";
import {User} from "@/model/User";
import {UserDto} from "@/dto/UserDto";

export class UserService extends BaseService<User, UserDto> {

  private static readonly USER_BASE_URL: string = "";

  constructor() {
    super(UserService.USER_BASE_URL);
  }

  add(user: User) {
    super.add(user);
  }

  update(user: User) {
    super.update(user);
  }

  getById(id: string)/*: User*/ {
    super.getById(id);
  }

  getAll() {
    super.getAll();
  }

  delete(id: string) {
    super.delete(id);
  }

  // TODO: login
  login(email: string, password: string)/*: User*/ {

  }
}
