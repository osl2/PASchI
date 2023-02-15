import axios from "axios";
import {UserDto} from "@/dto/UserDto";
import {RoleDto} from "@/dto/RoleDto";

const USER_BASE_URL: string = 'http://193.196.37.141/api/user';

test("addUser", () => {
  const userDto = new UserDto("0", "0", "0", "Gregor",
    "Snelting", "email", "password", false, RoleDto.USER, "0");
  axios.post(USER_BASE_URL, userDto).then((response) => {
    expect(response.data).toBeDefined();
    console.log(response.data);
  });
});
