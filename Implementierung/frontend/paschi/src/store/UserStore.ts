import {defineStore} from "pinia";
import {User} from "@/model/User";

export const useUserStore = defineStore('user', {
  state: () => ({
    user: undefined as User | undefined,
    nextId: 0
  }),
  actions: {
    getUser(): User | undefined {
      return this.user;
    },
    setUser(user: User) {
      this.user = user;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
