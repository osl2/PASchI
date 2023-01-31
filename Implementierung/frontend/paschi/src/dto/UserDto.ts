import {RoleDto} from "@/dto/RoleDto";

export class UserDto {

  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  auth: boolean ;
  role: RoleDto;
  token: string | undefined;

  constructor(id: string, firstName: string, lastName: string, email: string, password: string,
              auth: boolean, role: RoleDto, token: string | undefined) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.auth = auth;
    this.role = role;
    this.token = token;
  }
}
