import {BaseService} from "@/service/BaseService";
import {User} from "@/model/User";
import {UserDto} from "@/dto/UserDto";

export class UserService extends BaseService<User, UserDto> {

  private readonly USER_BASE_URL: string;

  constructor(base_url: string, USER_BASE_URL: string) {
    super(base_url);
    this.USER_BASE_URL = USER_BASE_URL;
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
