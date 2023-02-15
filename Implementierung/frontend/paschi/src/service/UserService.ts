import {BaseService} from "@/service/BaseService";
import {User} from "@/model/User";
import {UserDto} from "@/dto/UserDto";
import axios from "axios";
import {UserMapper} from "@/dto/mapper/UserMapper";
import {RoleDto} from "@/dto/RoleDto";

const USER_BASE_URL: string = 'http://193.196.37.141/api/user';

export class UserService extends BaseService<User, UserDto> {

  constructor() {
    super(UserMapper.getMapper());
  }

  addUser() {
    const userDto = new UserDto("0", "0", "0", "Gregor",
      "Snelting", "snelting@kit.edu", "password", true, RoleDto.USER, "0");
    axios.post(USER_BASE_URL, userDto).then((response) => {
      console.log(response.data);
    });
  }

  add(user: User) {
    const userDto = this.getMapper().modelToDto(user);
    axios.post(USER_BASE_URL + '', userDto).then((response) => {
      // irgendwas
    });
  }

  update(user: User) {
    const userDto = this.getMapper().modelToDto(user);
    axios.post(USER_BASE_URL + '', userDto).then((response) => {
      // irgendwas
    });
  }

  async getById(id: string): Promise<User | undefined> {
    let user;
    await axios.get(USER_BASE_URL + '').then((response) => {
      user = this.getMapper().dtoToModel(response.data);
    });

    if (user != undefined) {
      return user;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<User[]> {
    let users: User[] = [];
    axios.get(USER_BASE_URL + '').then((response) => {
      response.data.forEach((course: any) => {
        users.push(this.getMapper().dtoToModel(course));
      });
    });

    return users;
  }

  delete(id: string) {
    axios.delete(USER_BASE_URL + '').then((response) => {
      // irgendwas
    });
  }

  // TODO: login
  login(email: string, password: string)/*: User*/ {

  }
}
