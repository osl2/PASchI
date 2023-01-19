import {User} from "@/model/User";
import {useUserStore} from "@/store/UserStore";
import {Role} from "@/model/Role";

export class UserController {

  private static controller: UserController = new UserController();
  private userStore = useUserStore();

  private constructor() {
  }

  static getUserController(): UserController {
    return UserController.controller;
  }

  login(email: string, password: string) {

  }

  register(firstName: string, lastName: string, email: string, password: string, repeatPassword: string) {
    this.userStore.setUser(new User(undefined, 0, firstName, lastName, email, true, Role.USER,
      "token"));
  }

  update(firstName: string, lastName: string, email: string, password: string) {

  }

  changePassword(oldPassword: string, newPassword: string, repeatPassword: string) {

  }

  getUser(): User {
    return this.userStore.getUser()!;
  }

  delete() {

  }
}
