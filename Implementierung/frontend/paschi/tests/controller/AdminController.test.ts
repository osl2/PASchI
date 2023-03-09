import {AdminController} from "@/controller/AdminController";
import {UserController} from "@/controller/UserController";
import {createPinia, setActivePinia} from "pinia";
import {User} from "@/model/User";

setActivePinia(createPinia());

const admin = {email: "admin@kit.edu", password: "admin"};
const adminController = AdminController.getAdminController();
let users: User[] = [];

beforeAll(async () => {
  const userController = UserController.getUserController();
  for (let i = 0; i < 5; i++) {
    await userController.register(
      "name" + i,
      "name" + i,
      i + "@kit.edu",
      "password",
      "password"
    );
  }
  await userController.login(admin.email, admin.password);
});

test("Get users", async () => {
  users = await adminController.getUsers();

  expect(users.length).toBe(1);
});

test("Get users not authenticated", async () => {
  users = await adminController.getUsersNotAuthenticated();

  expect(users.length).toBe(5);
});

test("Auth user", async () => {
  for (const user of users) {
    await adminController.authUser(user.getId);
  }
  users = await adminController.getUsers();
  const noAuthUsers = await adminController.getUsersNotAuthenticated();

  expect(users.length).toBe(6);
  expect(noAuthUsers.length).toBe(0);
});

test("Delete user", async () => {
  for (const user of users) {
    if (user.email !== admin.email) {
      await adminController.deleteUser(user.getId);
    }
  }

  users = await adminController.getUsers();

  expect(users.length).toBe(1);
});
