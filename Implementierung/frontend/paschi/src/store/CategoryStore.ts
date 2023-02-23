import {defineStore} from "pinia";
import {Category} from "@/model/userdata/interactions/Category";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    ratedCategories: [] as RatedCategory[],
    nextId: 0
  }),
  actions: {
    addCategory(category: Category): string {
      this.categories.push(category);
      return category.getId;
    },
    addRatedCategory(catgeory: RatedCategory): string {
      this.ratedCategories.push(catgeory);
      return catgeory.getId;
    },
    deleteCategory(name: string) {
      this.categories.forEach((element, index) => {
        if (element.name === name) {
          this.categories.splice(index, 1);
        }
      });
      this.ratedCategories.forEach((element, index) => {
        if (element.name === name) {
          this.ratedCategories.splice(index, 1);
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
      this.ratedCategories.forEach((element) => {
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
      // @ts-ignore
      return this.categories;
    },
    getRatedCategories(name: string): RatedCategory[] {
      const categories: RatedCategory[] = [];
      this.ratedCategories.forEach((element) => {
        if (element.name === name) {
          // @ts-ignore
          categories.push(element);
        }
      });
      categories.sort((a: RatedCategory, b: RatedCategory) => {
        return (a.quality <= b.quality) ? 1 : -1;
      });

      return categories;
    },
    getNextId(): number {
      return this.nextId++;
    },
    getByName(name: string): Category[] {
      let categories: Category[] = [];
      this.categories.forEach((element) => {
        if (element.name === name) {
          // @ts-ignore
          categories.push(element);
        }
      });
      this.ratedCategories.forEach((element) => {
        if (element.name === name) {
          // @ts-ignore
          categories.push(element);
        }
      });

      return categories;
    },
    hasName(name: string): boolean {
      this.categories.forEach((element) => {
        if (element.name === name) {
          // @ts-ignore
          return true;
        }
      });

      return false;
    }
  }
})
