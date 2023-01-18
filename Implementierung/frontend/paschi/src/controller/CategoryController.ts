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

  createRatedCategory(name: string, quality: Quality): string {
    return "";
  }

  deleteCategory(id: string) {

  }

  updateCategory(id: string, name: string, quality: Quality) {

  }

  getCategories(): Category[] {
    return [];
  }
}
