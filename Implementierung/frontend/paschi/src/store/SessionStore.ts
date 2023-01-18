import {defineStore} from "pinia";
import {Session} from "@/model/userdata/courses/Session";

export const useSessionStore = defineStore('sessions', {
  state: () => ({
    sessions: [] as Session[]
  }),
  actions: {
    addSession(session: Session) {
      this.sessions.push(session);
    },
    deleteSession(id: string) {
      this.sessions.forEach((element, index) => {
        if (element.id === id) {
          this.sessions.splice(index, 1);
        }
      });
    },
    getSession(id: string): Session | undefined {
      this.sessions.forEach((element) => {
        if (element.id === id) {
          return element;
        }
      });
      return undefined;
    },
    getAllSessions(): Session[] {
      return this.sessions;
    }
  }
})
