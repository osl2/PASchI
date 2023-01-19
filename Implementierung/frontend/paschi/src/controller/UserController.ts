import {User} from "@/model/User";

export class UserController {

  private static controller: UserController = new UserController();

  private constructor() {
  }

  static getUserController(): UserController {
    return UserController.controller;
  }

  login(email: string, password: string) {

  }

  register(firstName: string, lastName: string, email: string, password: string, repeatPassword: string) {

  }

  update(firstName: string, lastName: string, email: string, password: string) {

  }

  changePassword(oldPassword: string, newPassword: string, repeatPassword: string) {

  }

  getUser(): User | undefined {
    // undefined entfernen nachdem implementiert
    return undefined
  }

  delete() {

  }
}
