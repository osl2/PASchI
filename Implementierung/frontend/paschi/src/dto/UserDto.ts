import {RoleDto} from "@/dto/RoleDto";

export class UserDto {

  id: string;
  firstName: string;
  lastName: string;
  email: string;
  auth: boolean;
  role: RoleDto;
  token: String;

  constructor(id: string, firstName: string, lastName: string, email: string, auth: boolean, role: RoleDto,
              token: String) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.auth = auth;
    this.role = role;
    this.token = token;
  }
}
