import {defineStore} from "pinia";
import {Category} from "@/model/userdata/interactions/Category";

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    nextId: 0
  }),
  actions: {
    addCategory(category: Category) {
      this.categories.push(category);
    },
    deleteCategory(id: string) {
      this.categories.forEach((element, index) => {
        if (element.getId === id) {
          this.categories.splice(index, 1);
        }
      });
    },
    getCategory(id: string): Category | undefined {
      this.categories.forEach((element, index) => {
        if (element.getId === id) {
          this.categories.splice(index, 1);
        }
      });
      return undefined;
    },
    getAllCategories(): Category[] {
      // @ts-ignore
      return this.categories;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
