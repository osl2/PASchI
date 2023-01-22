import {User} from "@/model/User";
import {useUserStore} from "@/store/UserStore";
import {Role} from "@/model/Role";

// TODO: Services fürs Backend einbinden
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
    let id = this.userStore.getNextId();
    // TODO: auth vom admin setzen
    this.userStore.setUser(new User(undefined, id, firstName, lastName, email, true, Role.USER,
      undefined));
  }

  update(firstName: string, lastName: string, email: string, password: string) {
    let user = this.userStore.getUser();
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
