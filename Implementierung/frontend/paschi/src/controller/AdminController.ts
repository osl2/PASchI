export class AdminController {

  private static controller: AdminController = new AdminController();
  static readonly defaultPassword: string = "default";

  private constructor() {
  }

  static getAdminController(): AdminController {
    return AdminController.controller;
  }

  authUser(userId: string) {

  }

  deleteUser(userId: string) {

  }

  resetPassword(userId: string) {

  }
}