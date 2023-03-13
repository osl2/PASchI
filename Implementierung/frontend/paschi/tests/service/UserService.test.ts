import {UserService} from "@/service/UserService";
import {User} from "@/model/User";
import {Role} from "@/model/Role";
import {createPinia, setActivePinia} from "pinia";
import {useUserStore} from "@/store/UserStore";

setActivePinia(createPinia());

const userService = UserService.getService();
const admin = {email: "admin@kit.edu", password: "admin"};

let user = new User(
  undefined,
  "Service",
  "Test",
  "service1@test.jest",
  "password",
  false,
  Role.USER,
  ""
);

test("Login", async () => {
  const _user = await userService.login(admin.email, admin.password);
  useUserStore().setUser(_user!);

  expect(_user).toBeDefined();
  expect(_user?.email).toBe(admin.email);
  expect(_user?.isAdmin()).toBeTruthy();
});

test("Add user and get all users", async () => {
  await userService.add(user);
  const users = (await userService.getAll()).filter(_user => _user.email === user.email);
  user.setId = users[0].getId;

  expect(users.length).toBe(1);
  expect(users[0].firstName).toBe(user.firstName);
  expect(users[0].lastName).toBe(user.lastName);
  expect(users[0].auth).toBeFalsy();
});

test("Get user by Id", async () => {
  const _user = await userService.getById(user.getId);

  expect(_user?.getId).toBe(user.getId);
  expect(_user?.email).toBe(user.email);
});

test("Admin update", async () => {
  user.auth = true;
  await userService.adminUpdate(user);
  const _user = await userService.getById(user.getId);

  expect(_user?.auth).toBeTruthy();
});

test("Update user", async () => {
  setActivePinia(createPinia());
  let _user = (await userService.login(user.email, user.password))!;
  useUserStore().setUser(_user);
  user.token = _user.token;
  user.firstName = "Gregor";
  user.lastName = "Snelting";
  _user.firstName = "Gregor";
  _user.lastName = "Snelting";
  await userService.update(_user);

  setActivePinia(createPinia());
  _user = (await userService.login(user.email, user.password))!;
  useUserStore().setUser(_user!);

  expect(_user?.getId).toBe(user.getId);
  expect(_user?.firstName).toBe("Gregor");
  expect(_user?.lastName).toBe("Snelting");
});

test("Get token", async () => {
  const _user = await userService.getToken(user.token);

  expect(_user).toBeDefined();
  expect(_user?.getId).toBe(user.getId);
});

test("Delete user", async () => {
  setActivePinia(createPinia());
  let _user = await userService.login(admin.email, admin.password);
  useUserStore().setUser(_user!);
  await userService.delete(user.getId);
  _user = await userService.login(user.email, user.password);

  expect(_user).toBeUndefined();
});
