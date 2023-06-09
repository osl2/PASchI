import {CategoryController, NAME_ERROR} from "@/controller/CategoryController";
import {Category} from "@/model/userdata/interactions/Category";
import {Quality} from "@/model/userdata/interactions/Quality";
import {afterEachTest, beforeEachTest} from "../setup";

const categoryController = CategoryController.getCategoryController();
const categoryData = {name: "Kategorie", qName: "Bewertete Kategorie"};
let categoryId: string
let category: Category | undefined;
let qCategoryId: string;
let qCategory: Category | undefined;

beforeAll(async () => {
  await beforeEachTest();
});

afterAll(async () => {
  await afterEachTest();
});

test("Create category", async () => {
  categoryId = await categoryController.createCategory(categoryData.name);
  const error = await categoryController.createCategory(categoryData.name);
  category = categoryController.getCategory(categoryId);

  expect(category).toBeDefined();
  expect(category?.name).toBe(categoryData.name);
  expect(category?.hasQuality()).toBeFalsy();
  expect(error).toBe(NAME_ERROR);
});

test("Create rated category", async () => {
  const error = await categoryController.createRatedCategory(categoryData.name);
  qCategoryId = await categoryController.createRatedCategory(categoryData.qName);
  qCategory = categoryController.getCategory(qCategoryId);

  expect(qCategory).toBeDefined();
  expect(qCategory?.name).toBe(categoryData.qName);
  expect(qCategory?.hasQuality()).toBeTruthy();
  expect(error).toBe(NAME_ERROR);
});

test("Get all categories", () => {
  const categories = categoryController.getAllCategories();

  expect(categories.length).toBe(5);
});

test("Get category with quality", () => {
  const categoryWithQuality = categoryController.getCategoryWithQuality(categoryData.qName, Quality.FIVE_STAR);

  expect(categoryWithQuality?.getQuality()).toBe(Quality.FIVE_STAR);
});

test("Get rated categories by name", () => {
  const categories = categoryController.getRatedCategoriesByName(categoryData.qName);

  expect(categories.length).toBe(5);
});

test("Delete category", async () => {
  await categoryController.deleteCategory(categoryId);
  category = categoryController.getCategory(categoryId);
  let categories = categoryController.getAllCategories();

  expect(category).toBeUndefined();
  expect(categories.length).toBe(4);

  await categoryController.deleteCategory(qCategoryId);
  qCategory = categoryController.getCategory(qCategoryId);
  categories = categoryController.getAllCategories();
  const ratedCategories = categoryController.getRatedCategoriesByName(categoryData.qName);

  expect(qCategory).toBeUndefined();
  expect(categories.length).toBe(3);
  expect(ratedCategories.length).toBe(0);
});

