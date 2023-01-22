import {RoleDto} from "@/dto/RoleDto";

export class UserDto {

  id: string | undefined;
  firstName: string;
  lastName: string;
  email: string;
  auth: boolean ;
  role: RoleDto;
  token: string | undefined;

  constructor(id: string | undefined, firstName: string, lastName: string, email: string, auth: boolean, role: RoleDto,
              token: string | undefined) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.auth = auth;
    this.role = role;
    this.token = token;
  }
}
