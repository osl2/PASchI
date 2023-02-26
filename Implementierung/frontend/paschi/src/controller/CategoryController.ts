import {Category} from "@/model/userdata/interactions/Category";
import {useCategoryStore} from "@/store/CategoryStore";
import {UserController} from "@/controller/UserController";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";
import {Quality} from "@/model/userdata/interactions/Quality";
import {CategoryService} from "@/service/CategoryService";

const NAME_ERROR = "Name schon vergeben";
const DEFAULT_CATEGORIES = ["Störung", "Antwort", "Frage"];

export class CategoryController {

  private static controller: CategoryController = new CategoryController();
  private categoryService = CategoryService.getService();

  private constructor() {
  }

  static getCategoryController(): CategoryController {
    return this.controller;
  }

  async createCategory(name: string): Promise<string> {
    if (useCategoryStore().hasName(name)) {
      return NAME_ERROR;
    }
    let category = new Category(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(), name);
    await this.categoryService.add(category);
    return useCategoryStore().addCategory(category);
  }

  async createRatedCategory(name: string): Promise<string> {
    if (useCategoryStore().hasName(name)) {
      return NAME_ERROR;
    }
    let categoryId;
    let category = new RatedCategory(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(),
      name, Quality.ONE_STAR);
    useCategoryStore().addRatedCategory(category)
    await this.categoryService.add(category);
    useCategoryStore().addCategory(category);
    categoryId = category.getId;

    category = new RatedCategory(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(),
      name, Quality.TWO_STAR);
    useCategoryStore().addRatedCategory(category)
    await this.categoryService.add(category);

    category = new RatedCategory(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(),
      name, Quality.THREE_STAR);
    useCategoryStore().addRatedCategory(category)
    await this.categoryService.add(category);

    category = new RatedCategory(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(),
      name, Quality.FOUR_STAR);
    useCategoryStore().addRatedCategory(category)
    await this.categoryService.add(category);

    category = new RatedCategory(undefined, useCategoryStore().getNextId(),
      UserController.getUserController().getUser(),
      name, Quality.FIVE_STAR);
    useCategoryStore().addRatedCategory(category)
    await this.categoryService.add(category);

    return categoryId;
  }

  async deleteCategory(id: string) {
    const category = useCategoryStore().getCategory(id);
    if (category !== undefined) {
      useCategoryStore().deleteCategory(category.name);
      await this.categoryService.delete(id);
    }
  }

  getCategory(id: string): Category | undefined {
    let category = useCategoryStore().getCategory(id);
    if (category == undefined) {
      return undefined;
    }

    return category;
  }

  getCategoryWithQuality(name: string, quality: Quality): RatedCategory | undefined {
    const categories = useCategoryStore().getRatedCategories(name);
    if (categories.length == 0) {
      return undefined;
    }
    let category;
    categories.forEach((element: RatedCategory) => {
      if (element.quality === quality) {
        category = element;
      }
    });

    if (category == undefined) {
      return undefined;
    }
    return category;
  }

  getCategories(): Category[] {
    return useCategoryStore().getAllCategories();
  }

  getRatedCategoriesByName(name: string): RatedCategory[] {
    return useCategoryStore().getRatedCategories(name);
  }

  async getAllCategories() {
    await this.categoryService.getAll();
    if (useCategoryStore().getAllCategories().length == 0) {
      await this.createCategory(DEFAULT_CATEGORIES[0]);
      await this.createRatedCategory(DEFAULT_CATEGORIES[1]);
      await this.createRatedCategory(DEFAULT_CATEGORIES[2]);
    }
  }
}
