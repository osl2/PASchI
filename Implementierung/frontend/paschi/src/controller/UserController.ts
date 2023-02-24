import {User} from "@/model/User";
import {useUserStore} from "@/store/UserStore";
import {Role} from "@/model/Role";
import {UserService} from "@/service/UserService";
import {CategoryController} from "@/controller/CategoryController";

/**
 * Steuert den Kontrollfluss für die Benutzerverwaltung.
 */
export class UserController {

  private static controller: UserController = new UserController();
  private userService = UserService.getService();

  private constructor() {
  }

  static getUserController(): UserController {
    return this.controller;
  }

  /**
   * Einloggen mit E-Mail und Passwort.
   *
   * @param email E-Mail
   * @param password Passwort
   */
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

  /**
   * Einloggen mit gültigem Token.
   */
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

  /**
   * Account-Registrierung
   *
   * @param firstName Vorname
   * @param lastName Nachname
   * @param email E-Mail
   * @param password Passwort
   * @param repeatPassword Passwort
   */
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

  /**
   * Aktualisieren der Benutzerdaten.
   *
   * @param firstName Vorname
   * @param lastName Nachname
   */
  async update(firstName: string, lastName: string) {
    let user = this.getUser();
    if (user !== undefined) {
      user.firstName = firstName;
      user.lastName = lastName;
      await this.userService.update(user);
    }
  }

  /**
   * Gibt den aktuellen Benutzer zurück.
   */
  getUser(): User {
    return useUserStore().getUser()!;
  }

  /**
   * Gibt zurück, ob man aktuell angemeldet ist.
   */
  isLoggedIn(): boolean {
    return useUserStore().isLoggedIn();
  }

  /**
   * Löscht den Benutzeraccount.
   */
  async delete() {
    const user = useUserStore().getUser();
    if (user !== undefined) {
      useUserStore().deleteUser();
      await this.userService.delete(user.getId);
    }
  }
}
