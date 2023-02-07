import {Role} from "@/model/Role";
import {DataObject} from "@/model/DataObject";

export class User extends DataObject {

  firstName: string;
  lastName: string;
  email: string;
  auth: boolean;
  role: Role;
  token: string | undefined;

  constructor(id: string | undefined, localId: number, firstName: string, lastName: string, email: string,
              auth: boolean, role: Role, token: string | undefined) {
    super(id, localId);
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.auth = auth;
    this.role = role;
    this.token = token;
  }
}
