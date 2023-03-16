import {LOGIN_SUCCESS, UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {createPinia, setActivePinia} from "pinia";
import {User} from "@/model/User";
import {UserService} from "@/service/UserService";
import {useUserStore} from "@/store/UserStore";

setActivePinia(createPinia());

const admin = {email: "admin@kit.edu", password: "admin"};
const userData = {firstName: "Test", lastName: "7", email: "test7@test.jest", password: "test"};
const userController = UserController.getUserController();
const adminController = AdminController.getAdminController();
let user: User;

beforeAll(async () => {
  await userController.register(
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password,
    userData.password
  );
  await userController.login(admin.email, admin.password);
  const users = await adminController.getUsersNotAuthenticated();

  for (const user of users) {
    await adminController.authUser(user.getId);
  }

  setActivePinia(createPinia());
});

afterAll(async () => {
  setActivePinia(createPinia());
  const _user = await UserService.getService().login(admin.email, admin.password);
  useUserStore().setUser(_user!);
  await UserService.getService().delete(user.getId);
});

test("Login", async () => {
  const response = await userController.login("24", "24");

  expect(response === LOGIN_SUCCESS).toBeFalsy();

  const repsonse = await userController.login(userData.email, userData.password);
  user = userController.getUser();

  expect(repsonse).toBe(LOGIN_SUCCESS);
  expect(user).toBeDefined();
  expect(user.email).toBe(userData.email);
  expect(user.firstName).toBe(userData.firstName);
  expect(user.lastName).toBe(userData.lastName);
  expect(userController.isLoggedIn()).toBeTruthy();
});

test("Update", async () => {
  const _firstName = "Luka";
  const _lastName = "Kosak";
  await userController.update(_firstName, _lastName);
  user = userController.getUser();

  expect(user.firstName).toBe(_firstName);
  expect(user.lastName).toBe(_lastName);
});

test("Login with token", async () => {
  try {
    await userController.loginWithToken(null);
  } catch (error) {
    console.log("localstorage undefined");
  }
  setActivePinia(createPinia());

  expect(userController.isLoggedIn()).toBeFalsy();

  const response = await userController.loginWithToken(user.token);
  user = userController.getUser();

  expect(response).toBe(LOGIN_SUCCESS);
  expect(user).toBeDefined();
  expect(userController.isLoggedIn()).toBeTruthy();
});

test("Logout", async () => {
  try {
    userController.logout();
  } catch (error) {
    console.log("localstorage undefined");
  }

  expect(userController.isLoggedIn()).toBeFalsy();
});
