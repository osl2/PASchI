import {defineStore} from "pinia";
import {Category} from "@/model/userdata/interactions/Category";

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[]
  }),
  actions: {
    addCategory(category: Category) {

    },
    deleteCategory(id: string) {

    },
    getCategory(id: string): Category {

    },
    getAllCategories(): Category[] {

    }
  }
})
