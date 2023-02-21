import {BaseService} from "@/service/BaseService";
import {User} from "@/model/User";
import {UserDto} from "@/dto/UserDto";
import axios, {AxiosResponse} from "axios";
import {UserMapper} from "@/dto/mapper/UserMapper";
import {useUserStore} from "@/store/UserStore";

const USER_BASE_URL: string = 'http://localhost:8080/api/user';

export class UserService extends BaseService<User, UserDto> {

  private static userService: UserService = new UserService();

  private constructor() {
    super(UserMapper.getMapper());
  }

  static getService(): UserService {
    return this.userService;
  }

  async add(user: User) {
    const userDto = this.getMapper().modelToDto(user);
    await axios.post(USER_BASE_URL, userDto).catch((error) => {
      console.log(error);
    });
  }

  update(user: User) {
    const userDto = this.getMapper().modelToDto(user);
    axios.put(USER_BASE_URL, userDto, {
      headers: {
        Authorization: `Bearer ${userDto.token}`
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async getById(id: string): Promise<User | undefined> {
    const token = useUserStore().getUser()?.token;
    let user;
    await axios.get(USER_BASE_URL + `/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response: AxiosResponse<UserDto>) => {
      user = this.getMapper().dtoToModel(response.data);
    }).catch((error) => {
      console.log(error);
    });

    if (user != undefined) {
      return user;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<User[]> {
    const token = useUserStore().getUser()?.token;
    let users: User[] = [];
    await axios.get(USER_BASE_URL + '/admin', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response: AxiosResponse<UserDto[]>) => {
      response.data.forEach((userDto: UserDto) => {
        users.push(this.getMapper().dtoToModel(userDto));
      });
    }).catch((error) => {
      console.log(error);
    });

    return users;
  }

  async delete(id: string) {
    const token = useUserStore().getUser()?.token;
    await axios.delete(USER_BASE_URL, {
      params: {
        id
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async login(email: string, password: string): Promise<User | undefined> {
    let user;
    await axios.post(USER_BASE_URL + "/login", null, {
      params: {
        email,
        password
      }
    }).then((response: AxiosResponse<UserDto>) => {
      user = this.getMapper().dtoToModel(response.data);
    }).catch((error) => {
      console.log(error);
    });

    if (user != undefined) {
      return user;
    } else {
      return undefined;
    }
  }

  async getToken() {
    const user = useUserStore().getUser();
    if (user == undefined) {
      return;
    }

    await axios.post(USER_BASE_URL + '/token', null, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }).then((response: AxiosResponse<UserDto>) => {
      user.token = response.data.token;
    }).catch((error) => {
      console.log(error);
    })
  }

  adminUpdate(user: User) {
    const token = useUserStore().getUser()?.token;
    const userDto = this.getMapper().modelToDto(user);
    axios.put(USER_BASE_URL + '/admin', userDto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
