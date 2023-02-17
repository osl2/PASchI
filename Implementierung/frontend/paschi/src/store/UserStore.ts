import {defineStore} from "pinia";
import {User} from "@/model/User";

export const useUserStore = defineStore('user', {
  state: () => ({
    user: undefined as User | undefined,
  }),
  actions: {
    getUser(): User | undefined {
      // @ts-ignore
      return this.user;
    },
    setUser(user: User) {
      this.user = user;
    },
    deleteUser() {
      this.user = undefined;
    }
  }
})
