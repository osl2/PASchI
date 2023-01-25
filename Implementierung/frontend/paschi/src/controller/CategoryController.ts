import {Quality} from "@/model/userdata/interactions/Quality";
import {Category} from "@/model/userdata/interactions/Category";
import {useCategoryStore} from "@/store/CategoryStore";
import {UserController} from "@/controller/UserController";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";

// TODO: Backend Service einbinden
export class CategoryController {

  private static controller: CategoryController = new CategoryController();
  private categoryStore = useCategoryStore();
  private userController = UserController.getUserController();

  private constructor() {
  }

  static getCategoryController(): CategoryController {
    return CategoryController.controller;
  }

  createCategory(name: string): string {
    let category = new Category(undefined, this.categoryStore.getNextId(), this.userController.getUser(), name);
    this.categoryStore.addCategory(category);

    return category.getId;
  }

  createRatedCategory(name: string, quality: Quality): string {
    let category = new RatedCategory(undefined, this.categoryStore.getNextId(), this.userController.getUser(), name,
      quality);
    this.categoryStore.addCategory(category);

    return category.getId;
  }

  deleteCategory(id: string) {
    this.categoryStore.deleteCategory(id);
  }

  updateCategory(id: string, name: string, quality: Quality) {
    let category = this.categoryStore.getCategory(id);
    if (category !== undefined) {
      category.name = name;
      category.setQuality = quality;
    }
  }

  getCategory(id: string): Category | undefined {
    let category = this.categoryStore.getCategory(id);
    if (category == undefined) {
      return undefined;
    }

    return category;
  }

  getCategories(): Category[] {
    return this.categoryStore.getAllCategories();
  }
}
