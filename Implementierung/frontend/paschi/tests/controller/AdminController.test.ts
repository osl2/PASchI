import {AdminController} from "@/controller/AdminController";
import {setActivePinia, createPinia} from "pinia";
import {UserController} from "@/controller/UserController";

// TODO: Backend

setActivePinia(createPinia());
const adminController = AdminController.getAdminController();
const userController = UserController.getUserController();
const firstName = "Gregor";
const lastName = "Snelting";
const email = "snelting@kit.edu";
const password = "exmatrikulaion";
userController.register(firstName, lastName, email, password, password);
const user = userController.getUser()!;

test("getUsers", () => {
  const users = adminController.getUsers();
  expect(users.pop()!.getId).toBe(user.getId);
});

test("authUser", () => {
  expect(user.auth).toBe(false);
  adminController.authUser(user.getId);
  expect(user.auth).toBe(true);
});
