import {User} from "@/model/User";
import {useUserStore} from "@/store/UserStore";
import {Role} from "@/model/Role";
import {UserService} from "@/service/UserService";
import {CategoryController} from "@/controller/CategoryController";
import {useStudentStore} from "@/store/ParticipantStore";
import {useCourseStore} from "@/store/CourseStore";
import {useSessionStore} from "@/store/SessionStore";
import {useCategoryStore} from "@/store/CategoryStore";
import {useInteractionStore} from "@/store/InteractionStore";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {useRoomObjectStore} from "@/store/RoomObjectStore";
import {useRoomStore} from "@/store/RoomStore";
import {usePositionStore} from "@/store/PositionStore";
import {ParticipantService} from "@/service/ParticipantService";
import {Teacher} from "@/model/userdata/interactions/Teacher";
import {CourseService} from "@/service/CourseService";
import {RoomService} from "@/service/RoomService";
import {SessionService} from "@/service/SessionService";

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
    const user = await this.userService.login(email, password);

    if (user == undefined) {
      return undefined;
    }

    useUserStore().setUser(user);
    await this.getData();
    return user.getId;
  }

  /**
   * Einloggen mit gültigem Token.
   */
  async loginWithToken(token: string | null): Promise<string | undefined> {
    if (token == null) {
      token = localStorage.getItem("token");
    }
    if (token == null) {
      return undefined;
    }
    const user = await this.userService.getToken(token);

    if (user == undefined) {
      return undefined;
    }

    useUserStore().setUser(user);
    await this.getData();
    return user.getId;
  }

  /**
   * Meldet den aktuellen Benutzer ab.
   */
  logout() {
    this.clearStores();
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
      ""
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
    const user = this.getUser();
    if (user) {
      user.firstName = firstName;
      user.lastName = lastName;
      await this.userService.update(user);
      const teacher = useStudentStore().getTeacher();
      if (teacher) {
        teacher.firstName = firstName;
        teacher.lastName = lastName;
        await ParticipantService.getService().update(teacher);
      }
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
    if (user) {
      await this.userService.delete(user.getId);
      this.clearStores();
    }
  }

  private async getData() {
    await this.getTeacher();
    await CourseService.getService().getAll();
    await SessionService.getService().getAll();
    await RoomService.getService().getAll();
    await CategoryController.getCategoryController().fetchCategories();
  }

  private clearStores() {
    useUserStore().$reset();
    useStudentStore().$reset();
    useCourseStore().$reset();
    useSessionStore().$reset();
    useCategoryStore().$reset();
    useInteractionStore().$reset();
    useSeatArrangementStore().$reset();
    useRoomObjectStore().$reset();
    useRoomStore().$reset();
    usePositionStore().$reset();
  }

  private async getTeacher() {
    await ParticipantService.getService().getAll();
    let teacher = useStudentStore().getTeacher();
    if (teacher == undefined) {
      const user = this.getUser();
      teacher = new Teacher(
        undefined,
        useStudentStore().getNextId(),
        user,
        user.firstName,
        user.lastName
      );
      await ParticipantService.getService().add(teacher);
      useStudentStore().setTeacher(teacher);
    }
  }
}
