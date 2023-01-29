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
      let category: Category;
      this.categories.forEach((element) => {
        if (element.getId === id) {
          // @ts-ignore
          category = element
        }
      });
      // @ts-ignore
      if (category !== undefined) {
        return category;
      }
      return undefined;
    },
    getAllCategories(): Category[] {
      return this.categories;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
