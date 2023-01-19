import {Role} from "@/model/Role";

export class User {

  id: number;
  firstName: string;
  lastName: string;
  email: string;
  auth: boolean;
  role: Role;
  token: string;

  constructor(id: number, firstName: string, lastName: string, email: string, auth: boolean,
              role: Role, token: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.auth = auth;
    this.role = role;
    this.token = token;
  }
}
