import { User } from "@/model/User";
import { UserService } from "@/service/UserService";

/**
 * Steuert den Kontrollfluss des Administrators
 */
export class AdminController {
  private static controller: AdminController = new AdminController();
  private userService = UserService.getService();

  private constructor() {}

  static getAdminController(): AdminController {
    return this.controller;
  }

  /**
   * Gibt alle Benutzer zurück.
   */
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

  /**
   * Gibt alle Benutzer zurück, die noch nicht freigeschaltet wurden.
   */
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

  /**
   * Schaltet einen Benutzer frei.
   *
   * @param userId ID des Benutzers
   */
  async authUser(userId: string) {
    await this.getUsersNotAuthenticated().then((response: User[]) => {
      response.forEach(async (user: User) => {
        if (user.getId === userId) {
          user.auth = true;
          await this.userService.adminUpdate(user);
          return;
        }
      });
    });
  }

  /**
   * Löscht einen Benutzer
   *
   * @param userId ID des Benutzers
   */
  async deleteUser(userId: string) {
    await this.userService.delete(userId);
  }
}
