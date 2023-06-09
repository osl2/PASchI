import {Role} from "@/model/Role";
import {DataObject} from "@/model/DataObject";

/**
 * Benutzer
 *
 * @author uekai
 * @version 1.0
 */
export class User extends DataObject {

  private _firstName: string;
  private _lastName: string;
  private readonly _email: string;
  private _password: string;
  private _auth: boolean;
  private readonly _role: Role;
  private _token: string;

  /**
   * Konstruktor
   *
   * @param id ID des Benutzers
   * @param firstName Vorname
   * @param lastName Nachname
   * @param email E-Mail
   * @param password Passwort
   * @param auth Wahrheitswert, ob Benutzer freigeschalten ist
   * @param role Rolle des Benutzers (Benutzer, Admin)
   * @param token Token zur Authentifikation
   */
  constructor(id: string | undefined, firstName: string, lastName: string, email: string, password: string,
              auth: boolean, role: Role, token: string) {
    super(id, 0);
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._password = password;
    this._auth = auth;
    this._role = role;
    this._token = token;
  }

  /**
   * Gibt zurück, ob der Benutzer ein Admin ist.
   */
  isAdmin(): boolean {
    return this._role == 'ADMIN';
  }

  /**
   * Gibt den Vornamen zurück.
   */
  get firstName(): string {
    return this._firstName;
  }

  /**
   * Setzt den Vornamen.
   *
   * @param value Vorname
   */
  set firstName(value: string) {
    this._firstName = value;
    this.update();
  }

  /**
   * Gibt den Nachnamen zurück.
   */
  get lastName(): string {
    return this._lastName;
  }

  /**
   * Setzt den Nachnamen.
   *
   * @param value Nachname
   */
  set lastName(value: string) {
    this._lastName = value;
    this.update();
  }

  /**
   * Gibt die E-Mail zurück.
   */
  get email(): string {
    return this._email;
  }

  /**
   * Gibt das Passwort zurück.
   */
  get password(): string {
    return this._password;
  }

  /**
   * Gibt den Wahrheitswert zurück, ob der Nutzer freigeschalten ist.
   */
  get auth(): boolean {
    return this._auth;
  }

  /**
   * Setzt den Wahrheitswert, ob der Nutzer freigeschalten ist
   *
   * @param value Wahrheitswert, ob der Nutzer freigeschalten ist
   */
  set auth(value: boolean) {
    this._auth = value;
    this.update();
  }

  /**
   * Gibt die Rolle zurück.
   */
  get role(): Role {
    return this._role;
  }

  /**
   * Gibt den Token zurück.
   */
  get token(): string {
    return this._token;
  }

  /**
   * Setzt den Token.
   *
   * @param value Token
   */
  set token(value: string) {
    this._token = value;
    this.update();
  }

  /**
   * Löscht das Passwort des Benutzers (nur lokal)
   */
  deletePassword() {
    this._password = "";
  }
}
