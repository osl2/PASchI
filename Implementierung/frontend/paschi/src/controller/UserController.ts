import {User} from "@/model/User";
import {useUserStore} from "@/store/UserStore";
import {Role} from "@/model/Role";
import {UserService} from "@/service/UserService";
import {CategoryController} from "@/controller/CategoryController";

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
    await CategoryController.getCategoryController().getAllCategories();
    return user.getId;
  }

  async loginWithToken(): Promise<string | undefined>  {
    await this.userService.getToken();
    if (useUserStore().isLoggedIn()) {
      await CategoryController.getCategoryController().getAllCategories();
    }
    return useUserStore().getUser()?.getId;
  }

  logout() {
    useUserStore().deleteUser();
    localStorage.clear();
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
    user.deletePassword();
  }

  async update(firstName: string, lastName: string) {
    let user = this.getUser();
    if (user !== undefined) {
      user.firstName = firstName;
      user.lastName = lastName;
      await this.userService.update(user);
    }
  }

  getUser(): User {
    return useUserStore().getUser()!;
  }

  isLoggedIn(): boolean {
    return useUserStore().isLoggedIn();
  }

  async delete() {
    const user = useUserStore().getUser();
    if (user !== undefined) {
      useUserStore().deleteUser();
      await this.userService.delete(user.getId);
    }
  }
}
