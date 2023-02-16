import {Category} from "@/model/userdata/interactions/Category";
import {useCategoryStore} from "@/store/CategoryStore";
import {UserController} from "@/controller/UserController";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";
import {Quality} from "@/model/userdata/interactions/Quality";

const NAME_ERROR = "Name schon vergeben";

// TODO: Backend Service einbinden
export class CategoryController {

  private static controller: CategoryController = new CategoryController();
  private userController = UserController.getUserController();
  private categoryStore = useCategoryStore();

  private constructor() {
    if (this.categoryStore.getAllCategories().length == 0) {
      this.createCategory("Störung");
      this.createRatedCategory("Antwort");
      this.createRatedCategory("Frage");
    }
  }

  static getCategoryController(): CategoryController {
    return this.controller;
  }

  createCategory(name: string): string {
    if (this.categoryStore.hasName(name)) {
      return NAME_ERROR;
    }
    let category = new Category(undefined, this.categoryStore.getNextId(), this.userController.getUser(), name);
    this.categoryStore.addCategory(category);

    return category.getId;
  }

  createRatedCategory(name: string): string {
    if (this.categoryStore.hasName(name)) {
      return NAME_ERROR;
    }
    let categoryId = "";
    for (let i = 0; i < 5; i++) {
      let category = new RatedCategory(undefined, this.categoryStore.getNextId(), this.userController.getUser(),
        name, i);
      this.categoryStore.addRatedCategory(category)
      if (i == 0) {
        this.categoryStore.addCategory(category);
        categoryId = category.getId;
      }
    }

    return categoryId;
  }

  deleteCategory(id: string) {
    const category = this.categoryStore.getCategory(id);
    if (category !== undefined) {
      this.categoryStore.deleteCategory(category.name);
    }
  }

  updateCategory(id: string, name: string) {
    if (this.categoryStore.hasName(name)) {
      return NAME_ERROR;
    }
    let category = this.categoryStore.getCategory(id);
    if (category !== undefined) {
      let categories = this.categoryStore.getByName(category.name);
      categories.forEach((category: Category) => {
        category.name = name;
      });
    }
  }

  getCategory(id: string): Category | undefined {
    let category = this.categoryStore.getCategory(id);
    if (category == undefined) {
      return undefined;
    }

    return category;
  }

  getCategoryWithQuality(name: string, quality: Quality): RatedCategory | undefined {
    const categories = this.categoryStore.getRatedCategories(name);
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
    return this.categoryStore.getAllCategories();
  }

  getRatedCategoriesByName(name: string): RatedCategory[] {
    return this.categoryStore.getRatedCategories(name);
  }
}
