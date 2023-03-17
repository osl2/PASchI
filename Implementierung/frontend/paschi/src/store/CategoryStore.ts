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
          this.ratedCategories.splice(index, 5);
        }
      });
    },
    getCategory(id: string): Category | undefined {
      for (const category of this.categories) {
        if (category.getId === id) {
          return <Category>category;
        }
      }
      for (const category of this.ratedCategories) {
        if (category.getId === id) {
          return <RatedCategory>category;
        }
      }
      return undefined;
    },
    getAllCategories(): Category[] {
      return <Category[]>this.categories;
    },
    getRatedCategories(name: string): RatedCategory[] {
      const categories = <RatedCategory[]>this.ratedCategories.filter(category => category.name === name);
      categories.sort((a: RatedCategory, b: RatedCategory) => {
        return (a.getQuality()! <= b.getQuality()!) ? 1 : -1;
      });

      return categories;
    },
    getNextId(): number {
      return this.nextId++;
    },
    hasName(name: string): boolean {
      return this.categories.find(category => category.name === name) != undefined;
    }
  }
})
