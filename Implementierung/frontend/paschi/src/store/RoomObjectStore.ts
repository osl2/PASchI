import {defineStore} from "pinia";

export const useRoomObjectStore = defineStore('roomObjects', {
  state: () => ({
    nextId: 0
  }),
  actions: {
    getNextId(): number {
      return this.nextId++;
    }
  }
})
