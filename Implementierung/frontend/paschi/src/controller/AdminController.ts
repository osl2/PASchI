import { User } from "@/model/User";
import { UserService } from "@/service/UserService";

export class AdminController {
  private static controller: AdminController = new AdminController();
  private userService = UserService.getService();
  static readonly defaultPassword: string = "default";

  private constructor() {}

  static getAdminController(): AdminController {
    return this.controller;
  }

  async getUsers(): Promise<User[]> {
    let users: User[] = [];
    await this.userService.getAll().then((response: User[]) => {
      response.forEach((user: User) => {
        if (user.auth) {
          users.push(user);
        }
      });
    });

    return users;
  }

  async getUsersNotAuthenticated(): Promise<User[]> {
    let users: User[] = [];
    await this.userService.getAll().then((response: User[]) => {
      response.forEach((user: User) => {
        if (!user.auth) {
          users.push(user);
        }
      });
    });

    return users;
  }

  async authUser(userId: string) {
    await this.getUsersNotAuthenticated().then((response: User[]) => {
      response.forEach((user: User) => {
        if (user.getId === userId) {
          user.auth = true;
          this.userService.adminUpdate(user);
          return;
        }
      });
    });
  }

  async deleteUser(userId: string) {
    await this.userService.delete(userId);
  }

  // resetPassword(userId: string) {
  //
  // }
}
