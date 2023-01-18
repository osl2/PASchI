import {defineStore} from "pinia";
import {Category} from "@/model/userdata/interactions/Category";

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[]
  }),
  actions: {
    addCategory(category: Category) {
      this.categories.push(category);
    },
    deleteCategory(id: string) {
      this.categories.forEach((element, index) => {
        if (element.id === id) {
          this.categories.splice(index, 1);
        }
      });
    },
    getCategory(id: string): Category | undefined {
      this.categories.forEach((element, index) => {
        if (element.id === id) {
          this.categories.splice(index, 1);
        }
      });
      return undefined;
    },
    getAllCategories(): Category[] {
      return this.categories;
    }
  }
})
