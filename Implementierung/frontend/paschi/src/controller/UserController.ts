import {User} from "@/model/User";
import {useUserStore} from "@/store/UserStore";
import {Role} from "@/model/Role";
import {createPinia} from "pinia";
import {UserService} from "@/service/UserService";

export class UserController {

  private static controller: UserController = new UserController();
  private userStore = useUserStore(createPinia());
  private userService = UserService.getService();

  private constructor() {
  }

  static getUserController(): UserController {
    return this.controller;
  }

  async login(email: string, password: string): Promise<string | undefined> {
    let user: User | undefined;
    await this.userService.login(email, password).then((response: User | undefined) => {
      user = response;
    });

    if (user == undefined) {
      return undefined;
    }

    this.userStore.setUser(user);
    return user.getId;
  }

  register(firstName: string, lastName: string, email: string, password: string, repeatPassword: string) {
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
    this.userService.add(user);
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
    return this.userStore.getUser()!;
  }

  delete() {
    const user = this.userStore.getUser();
    if (user !== undefined) {
      this.userStore.deleteUser();
      this.userService.delete(user.getId);
    }
  }
}
