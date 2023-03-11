import {defineStore} from "pinia";
import {User} from "@/model/User";

export const useUserStore = defineStore('user', {
  state: () => ({
    user: undefined as User | undefined,
  }),
  actions: {
    getUser(): User | undefined {
      return <User>this.user;
    },
    setUser(user: User) {
      this.user = user;
    },
    isLoggedIn(): boolean {
      return this.user !== undefined;
    },
    deleteUser() {
      this.user = undefined;
    }
  }
})
