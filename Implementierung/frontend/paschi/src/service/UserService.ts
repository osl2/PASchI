import {BaseService} from "@/service/BaseService";
import {User} from "@/model/User";
import {UserDto} from "@/dto/UserDto";

const USER_BASE_URL: string = "";

export class UserService extends BaseService<User, UserDto> {

  constructor() {
    super(USER_BASE_URL);
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
