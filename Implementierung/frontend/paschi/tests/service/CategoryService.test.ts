import {CategoryService} from "@/service/CategoryService";
import {UserController} from "@/controller/UserController";
import {Category} from "@/model/userdata/interactions/Category";
import {afterEachTest, beforeEachTest} from "../setup";

const service = CategoryService.getService();
let category: Category;

beforeAll(async () => {
  await beforeEachTest();

  category = new Category(
    undefined,
    0,
    UserController.getUserController().getUser(),
    "Kategorie"
  );
});

afterAll(async () => {
  await afterEachTest();
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
