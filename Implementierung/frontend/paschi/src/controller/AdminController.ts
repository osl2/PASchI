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
    const users = await this.userService.getAll();
    return users.filter(user => user.auth);
  }

  /**
   * Gibt alle Benutzer zurück, die noch nicht freigeschaltet wurden.
   */
  async getUsersNotAuthenticated(): Promise<User[]> {
    const users = await this.userService.getAll();
    return users.filter(user => !user.auth);
  }

  /**
   * Schaltet einen Benutzer frei.
   *
   * @param userId ID des Benutzers
   */
  async authUser(userId: string) {
    const users = await this.getUsersNotAuthenticated();
    for (const user of users) {
      if (user.getId === userId) {
        user.auth = true;
        await this.userService.adminUpdate(user);
        return;
      }
    }
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
