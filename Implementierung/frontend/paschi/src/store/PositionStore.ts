import {defineStore} from "pinia";

export const usePositionStore = defineStore('positions', {
  state: () => ({
    nextId: 0
  }),
  actions: {
    getNextId(): number {
      return this.nextId++;
    }
  }
})
