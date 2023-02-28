import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {User} from "@/model/User";
import {createPinia, setActivePinia} from "pinia";

setActivePinia(createPinia());

const admin = {email: "admin@kit.edu", password: "admin"};
const user = {firstName: "Unit", lastName: "Test", email: "unit@test.jest", password: "test"};

const userController = UserController.getUserController();
const adminController = AdminController.getAdminController();
let userId: string;

export async function beforeEachTest() {
  await userController.register(
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.password
  );

  await userController.login(admin.email, admin.password);
  adminController.getUsersNotAuthenticated().then((users: User[]) => {
    users.forEach((user: User) => adminController.authUser(user.getId));
  });

  await userController.login(admin.email, admin.password).then((id: string | undefined) => {
    if (id != undefined) {
      userId = id;
    }
  });
}

export async function afterEachTest() {
  // TODO: Benutzen, sobald man im Backend löschen kann @ugqbo
  //await userController.delete();
}
