import {User} from "@/model/User";
import {useUserStore} from "@/store/UserStore";
import {Role} from "@/model/Role";
import {createPinia} from "pinia";
import {UserService} from "@/service/UserService";

// TODO: Services fürs Backend einbinden
export class UserController {

  private static controller: UserController = new UserController();
  private userStore = useUserStore(createPinia());
  private userService = UserService.getService();

  private constructor() {
  }

  static getUserController(): UserController {
    return this.controller;
  }

  async login(email: string, password: string): Promise<User | undefined> {
    return this.userService.login(email, password);
  }

  register(firstName: string, lastName: string, email: string, password: string, repeatPassword: string) {
    const user = new User(
      undefined,
      firstName,
      lastName,
      email,
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
      // TODO: Backend einbinden
    }
  }

  changePassword(oldPassword: string, newPassword: string, repeatPassword: string) {

  }

  getUser(): User {
    return this.userStore.getUser()!;
  }

  delete() {

  }
}
