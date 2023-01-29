import {defineStore} from "pinia";

export const useInteractionStore = defineStore('interactions', {
  state: () => ({
    nextId: 0
  }),
  actions: {
    getNextId(): number {
      return this.nextId++;
    }
  }
})
