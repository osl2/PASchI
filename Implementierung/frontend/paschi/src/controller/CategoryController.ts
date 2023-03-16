import {Category} from "@/model/userdata/interactions/Category";
import {useCategoryStore} from "@/store/CategoryStore";
import {UserController} from "@/controller/UserController";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";
import {Quality} from "@/model/userdata/interactions/Quality";
import {CategoryService} from "@/service/CategoryService";

export const NAME_ERROR = "Name schon vergeben";
export const DEFAULT_CATEGORIES = ["Störung", "Antwort", "Frage"];

export class CategoryController {

  private static controller: CategoryController = new CategoryController();

  private constructor() {
  }

  static getCategoryController(): CategoryController {
    return this.controller;
  }

  async createCategory(name: string): Promise<string> {
    if (useCategoryStore().hasName(name)) {
      return NAME_ERROR;
    }
    const category = new Category(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(), name);

    await CategoryService.getService().add(category);
    return useCategoryStore().addCategory(category);
  }

  async createRatedCategory(name: string): Promise<string> {
    const categoryService = CategoryService.getService();
    if (useCategoryStore().hasName(name)) {
      return NAME_ERROR;
    }
    let category = new RatedCategory(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(),
      name, Quality.ONE_STAR);

    useCategoryStore().addRatedCategory(category)
    await categoryService.add(category);
    useCategoryStore().addCategory(category);
    const categoryId = category.getId;

    category = new RatedCategory(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(),
      name, Quality.TWO_STAR);

    useCategoryStore().addRatedCategory(category)
    await categoryService.add(category);

    category = new RatedCategory(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(),
      name, Quality.THREE_STAR);

    useCategoryStore().addRatedCategory(category)
    await categoryService.add(category);

    category = new RatedCategory(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(),
      name, Quality.FOUR_STAR);

    useCategoryStore().addRatedCategory(category)
    await categoryService.add(category);

    category = new RatedCategory(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(),
      name, Quality.FIVE_STAR);

    useCategoryStore().addRatedCategory(category)
    await categoryService.add(category);

    return categoryId;
  }

  async deleteCategory(id: string) {
    const category = useCategoryStore().getCategory(id);
    if (category) {
      await CategoryService.getService().delete(id);
      useCategoryStore().deleteCategory(category.name);
    }
  }

  getCategory(id: string): Category | undefined {
    return useCategoryStore().getCategory(id);
  }

  getCategoryWithQuality(name: string, quality: Quality): RatedCategory | undefined {
    const categories = useCategoryStore().getRatedCategories(name);
    if (categories.length == 0) {
      return undefined;
    }
    return categories.find(category => category.getQuality() === quality);
  }

  getAllCategories(): Category[] {
    return useCategoryStore().getAllCategories();
  }

  getRatedCategoriesByName(name: string): RatedCategory[] {
    return useCategoryStore().getRatedCategories(name);
  }

  async fetchCategories() {
    await CategoryService.getService().getAll();
    if (useCategoryStore().getAllCategories().length == 0) {
      await this.createCategory(DEFAULT_CATEGORIES[0]);
      await this.createRatedCategory(DEFAULT_CATEGORIES[1]);
      await this.createRatedCategory(DEFAULT_CATEGORIES[2]);
    }
  }
}
