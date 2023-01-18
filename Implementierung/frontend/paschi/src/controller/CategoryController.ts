import {Quality} from "@/model/userdata/interactions/Quality";
import {Category} from "@/model/userdata/interactions/Category";

export class CategoryController {

  private static controller: CategoryController = new CategoryController();

  private constructor() {
  }

  static getCategoryController(): CategoryController {
    return CategoryController.controller;
  }

  createCategory(name: string): number {
    return 0;
  }

  createRatedCategory(name: string, quality: Quality): number {
    return 0;
  }

  deleteCategory(id: number) {

  }

  updateCategory(id: number, name: string, quality: Quality) {

  }

  getCategories(): Category[] {
    return [];
  }
}
