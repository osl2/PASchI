import {defineStore} from "pinia";
import {Session} from "@/model/userdata/courses/Session";

export const useSessionStore = defineStore('sessions', {
  state: () => ({
    sessions: [] as Session[],
    nextId: 0
  }),
  actions: {
    addSession(session: Session): string {
      this.sessions.push(session);
      return session.getId;
    },
    deleteSession(id: string) {
      this.sessions.forEach((element, index) => {
        if (element.getId === id) {
          this.sessions.splice(index, 1);
        }
      });
    },
    getSession(id: string): Session | undefined {
      for (const session of this.sessions) {
        if (session.getId === id) {
          return <Session>session;
        }
      }
      return undefined;
    },
    getAllSessions(): Session[] {
      return <Session[]>this.sessions;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
