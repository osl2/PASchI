import {User} from "@/model/User";
import {useUserStore} from "@/store/UserStore";
import {Role} from "@/model/Role";
import {createPinia} from "pinia";
import {CategoryController} from "@/controller/CategoryController";

// TODO: Services fürs Backend einbinden
export class UserController {

  private static controller: UserController = new UserController();
  private categoryController: CategoryController = CategoryController.getCategoryController();
  private userStore = useUserStore(createPinia());

  private constructor() {
  }

  static getUserController(): UserController {
    return this.controller;
  }

  login(email: string, password: string): boolean {
    // nur lokal
    let user = this.getUser();
    return user.email === email && user.auth;

  }

  register(firstName: string, lastName: string, email: string, password: string, repeatPassword: string) {
    // TODO: auth vom admin setzen
    this.categoryController.createCategory("Störung");
    this.categoryController.createRatedCategory("Antwort");
    this.categoryController.createRatedCategory("Frage");
    this.userStore.setUser(
      new User(
        undefined,
        this.userStore.getNextId(),
        firstName,
        lastName,
        email,
        false,
        Role.USER,
        undefined
      ));
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
