import {useUserStore} from "@/store/UserStore";
import {User} from "@/model/User";

export class AdminController {

  private static controller: AdminController = new AdminController();
  static readonly defaultPassword: string = "default";

  private constructor() {
  }

  static getAdminController(): AdminController {
    return AdminController.controller;
  }

  getUsers(): User[] {
    // nur lokal
    let users: User[] | undefined = [];
    let user = useUserStore().getUser();
    if (user !== undefined) {
      users.push(user);
    }
    return users;
  }

  authUser(userId: string) {
    let users: User[] = this.getUsers();
    users.forEach(user => {
      if (user.getId === userId) {
        user.auth = true;
      }
    });
  }

  deleteUser(userId: string) {

  }

  resetPassword(userId: string) {

  }
}
