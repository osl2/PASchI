import {CategoryService} from "@/service/CategoryService";
import {createPinia, setActivePinia} from "pinia";
import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {Category} from "@/model/userdata/interactions/Category";

const service = CategoryService.getService();
let category: Category;

beforeAll(async () => {
  // await beforeEachTest();
  // TODO: Entfernen, wenn das Backend richtig läuft @ugqbo
  setActivePinia(createPinia());
  const admin = {email: "admin@kit.edu", password: "admin"};
  const user = {firstName: "Service", lastName: "Test", email: "service7@test.jest", password: "test"};
  const userController = UserController.getUserController();
  const adminController = AdminController.getAdminController();

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

  category = new Category(
    undefined,
    0,
    userController.getUser(),
    "Kategorie"
  );
});

test("Add and get category", async () => {
  await service.add(category);
  const categories = (await service.getAll()).filter(_category => _category.name === category.name);
  category.setId = categories[0].getId;

  expect(categories.length).toBe(1);
  expect(categories[0].name).toBe(category.name);
});

test("Get category by id", async () => {
  const _category = await service.getById(category.getId);

  expect(_category?.getId).toBe(category.getId);
  expect(_category?.name).toBe(category.name);
});

test("Update category", async () => {
  category.name = "Schlag";
  await service.update(category);
  const _category = await service.getById(category.getId);

  expect(_category?.name).toBe("Schlag");
});

test("Delete category", async () => {
  await service.delete(category.getId);
  const _category = await service.getById(category.getId);

  expect(_category).toBeUndefined();
});
