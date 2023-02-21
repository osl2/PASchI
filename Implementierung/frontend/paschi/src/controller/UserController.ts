import {User} from "@/model/User";
import {useUserStore} from "@/store/UserStore";
import {Role} from "@/model/Role";
import {UserService} from "@/service/UserService";

export class UserController {

  private static controller: UserController = new UserController();
  private userService = UserService.getService();

  private constructor() {
  }

  static getUserController(): UserController {
    return this.controller;
  }

  async login(email: string, password: string): Promise<string | undefined> {
    let user: User | undefined;
    user = await this.userService.login(email, password);

    if (user == undefined) {
      return undefined;
    }

    useUserStore().setUser(user);
    return user.getId;
  }

  async register(firstName: string, lastName: string, email: string, password: string, repeatPassword: string) {
    if (password !== repeatPassword) {
      return;
    }
    const user = new User(
      undefined,
      firstName,
      lastName,
      email,
      password,
      false,
      Role.USER,
      undefined
    );
    await this.userService.add(user);
  }

  update(firstName: string, lastName: string, email: string, password: string) {
    let user = this.getUser();
    if (user !== undefined) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      this.userService.update(user);
    }
  }

  getUser(): User {
    return useUserStore().getUser()!;
  }

  delete() {
    const user = useUserStore().getUser();
    if (user !== undefined) {
      useUserStore().deleteUser();
      this.userService.delete(user.getId);
    }
  }
}
