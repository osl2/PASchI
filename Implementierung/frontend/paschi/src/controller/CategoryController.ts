import {Category} from "@/model/userdata/interactions/Category";
import {useCategoryStore} from "@/store/CategoryStore";
import {UserController} from "@/controller/UserController";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";
import {Quality} from "@/model/userdata/interactions/Quality";
import {CategoryService} from "@/service/CategoryService";

const NAME_ERROR = "Name schon vergeben";
const DEFAULT_ERROR = "Name von Standard Kategorie kann nicht geändert werden"
const DEFAULT_CATEGORIES = ["Störung", "Antwort", "Frage"];

export class CategoryController {

  private static controller: CategoryController = new CategoryController();
  private userController = UserController.getUserController();
  private categoryService = CategoryService.getService();

  private constructor() {
    this.categoryService.getAll().then(() => {
      if (useCategoryStore().getAllCategories().length == 0) {
        this.createCategory(DEFAULT_CATEGORIES[0]).then();
        this.createRatedCategory(DEFAULT_CATEGORIES[1]).then();
        this.createRatedCategory(DEFAULT_CATEGORIES[2]).then();
      }
    });
  }

  static getCategoryController(): CategoryController {
    return this.controller;
  }

  async createCategory(name: string): Promise<string> {
    if (useCategoryStore().hasName(name)) {
      return NAME_ERROR;
    }
    let category = new Category(undefined, useCategoryStore().getNextId(), this.userController.getUser(), name);
    await this.categoryService.add(category);
    return useCategoryStore().addCategory(category);
  }

  async createRatedCategory(name: string): Promise<string> {
    if (useCategoryStore().hasName(name)) {
      return NAME_ERROR;
    }
    let categoryId = "";
    for (let i = 0; i < 5; i++) {
      let category = new RatedCategory(undefined, useCategoryStore().getNextId(), this.userController.getUser(),
        name, i);
      useCategoryStore().addRatedCategory(category)
      await this.categoryService.add(category);
      if (i == 0) {
        useCategoryStore().addCategory(category);
        categoryId = category.getId;
      }
    }

    return categoryId;
  }

  async deleteCategory(id: string) {
    const category = useCategoryStore().getCategory(id);
    if (category !== undefined) {
      useCategoryStore().deleteCategory(category.name);
      await this.categoryService.delete(id);
    }
  }

  async updateCategory(id: string, name: string): Promise<string> {
    if (useCategoryStore().hasName(name)) {
      return NAME_ERROR;
    }
    let category = useCategoryStore().getCategory(id);
    if (category !== undefined) {
      if (DEFAULT_CATEGORIES.includes(category.name)) {
        return DEFAULT_ERROR;
      }
      let categories = useCategoryStore().getByName(category.name);
      await categories.forEach((category: Category) => {
        category.name = name;
        this.categoryService.update(category);
      });
    }

    return name;
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
}
