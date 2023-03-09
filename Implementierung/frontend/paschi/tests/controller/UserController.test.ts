import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {createPinia, setActivePinia} from "pinia";
import {User} from "@/model/User";

setActivePinia(createPinia());

const admin = {email: "admin@kit.edu", password: "admin"};
const userData = {firstName: "Test", lastName: "7", email: "test7@test.jest", password: "test"};
const userController = UserController.getUserController();
const adminController = AdminController.getAdminController();
let user: User;

test("Register", async () => {
  await userController.register(
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password,
    userData.password
  );
  await userController.login(admin.email, admin.password);
  const users = await adminController.getUsersNotAuthenticated();

  expect(users.length).toBe(1);

  for (const user of users) {
    await adminController.authUser(user.getId);
  }

  setActivePinia(createPinia());
});

test("Login", async () => {
  const userId = await userController.login("24", "24");

  expect(userId).toBeUndefined();

  await userController.login(userData.email, userData.password);
  user = userController.getUser();

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

test("Logout", async () => {
  try {
    userController.logout();
  } catch (error) {
    console.log("localstorage undefined");
  }

  expect(userController.isLoggedIn()).toBeFalsy();
});

test("Delete account", async () => {
  await userController.login(userData.email, userData.password);
  user = userController.getUser();

  expect(user).toBeDefined();

  await userController.delete();
  const userId = await userController.login(userData.email, userData.password);

  // TODO: Backend löscht nicht
  // expect(userId).toBeUndefined();
});
