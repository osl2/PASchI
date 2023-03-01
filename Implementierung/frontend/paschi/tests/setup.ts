import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {createPinia, setActivePinia} from "pinia";

setActivePinia(createPinia());

const admin = {email: "admin@kit.edu", password: "admin"};
const user = {firstName: "Unit", lastName: "Test", email: "unit@test.jest", password: "test"};

const userController = UserController.getUserController();
const adminController = AdminController.getAdminController();

export async function beforeEachTest() {
  await userController.register(
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.password
  );

  await userController.login(admin.email, admin.password);
  const users = await adminController.getUsersNotAuthenticated();
  for (const user of users) {
    await adminController.authUser(user.getId);
  }

  setActivePinia(createPinia());

  await userController.login(user.email, user.password);
}

export async function afterEachTest() {
  await userController.delete();
}
