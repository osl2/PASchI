import {Role} from "@/model/Role";
import {DataObject} from "@/model/DataObject";

export class User extends DataObject {

  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _password: string;
  private _auth: boolean;
  private _role: Role;
  private _token: string | undefined;

  constructor(id: string | undefined, firstName: string, lastName: string, email: string, password: string,
              auth: boolean, role: Role, token: string | undefined) {
    super(id, 0);
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._password = password;
    this._auth = auth;
    this._role = role;
    this._token = token;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get auth(): boolean {
    return this._auth;
  }

  get role(): Role {
    return this._role;
  }

  get token(): string | undefined {
    return this._token;
  }

  set firstName(value: string) {
    this._firstName = value;
    this.update();
  }

  set lastName(value: string) {
    this._lastName = value;
    this.update();
  }

  set email(value: string) {
    this._email = value;
    this.update();
  }

  set auth(value: boolean) {
    this._auth = value;
    this.update();
  }

  set role(value: Role) {
    this._role = value;
    this.update();
  }

  set token(value: string | undefined) {
    this._token = value;
    this.update();
  }

  deletePassword() {
    this._password = "";
  }
}
