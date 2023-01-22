import {Role} from "@/model/Role";

export class User {

  private id: string | undefined;
  localId: number;
  firstName: string;
  lastName: string;
  email: string;
  auth: boolean;
  role: Role;
  token: string;

  constructor(id: string | undefined, localId: number, firstName: string, lastName: string, email: string, auth: boolean,
              role: Role, token: string) {
    this.id = id;
    this.localId = localId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.auth = auth;
    this.role = role;
    this.token = token;
  }

  hasId(): boolean {
    return this.id != undefined;
  }

  get getId(): string {
    if (this.id == undefined) {
      return this.localId.toString();
    }
    return this.id;
  }

  set setId(id: string) {
    this.id = id;
  }
}
