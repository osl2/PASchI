import {RoleDto} from "@/dto/RoleDto";

export class UserDto {

  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  auth: boolean ;
  role: RoleDto;
  token: string | undefined;

  constructor(id: string, createdAt: string, updatedAt: string, firstName: string, lastName: string, email: string,
              password: string, auth: boolean, role: RoleDto, token: string | undefined) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.auth = auth;
    this.role = role;
    this.token = token;
  }
}
