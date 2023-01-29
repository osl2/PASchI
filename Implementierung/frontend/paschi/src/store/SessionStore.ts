import {defineStore} from "pinia";
import {Session} from "@/model/userdata/courses/Session";

export const useSessionStore = defineStore('sessions', {
  state: () => ({
    sessions: [] as Session[],
    nextId: 0
  }),
  actions: {
    addSession(session: Session) {
      this.sessions.push(session);
    },
    deleteSession(id: string) {
      this.sessions.forEach((element, index) => {
        if (element.getId === id) {
          this.sessions.splice(index, 1);
        }
      });
    },
    getSession(id: string): Session | undefined {
      let session: Session;
      this.sessions.forEach((element) => {
        if (element.getId === id) {
          // @ts-ignore
          session = element;
        }
      });
      // @ts-ignore
      if (session !== undefined) {
        return session;
      }
      return undefined;
    },
    getAllSessions(): Session[] {
      // @ts-ignore
      return this.sessions;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
