import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {createPinia, setActivePinia} from "pinia";
import {UserService} from "@/service/UserService";
import {useUserStore} from "@/store/UserStore";

setActivePinia(createPinia());

const admin = {email: "admin@kit.edu", password: "admin"};
const user = {firstName: "Unit", lastName: "Test", email: "unit@test.jest", password: "test"};
let userId: string;

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

  userId = (await userController.login(user.email, user.password))!;
}

export async function afterEachTest() {
  setActivePinia(createPinia());
  let _user = await UserService.getService().login(admin.email, admin.password);
  useUserStore().setUser(_user!);
  await UserService.getService().delete(userId);
}
