import {defineStore} from "pinia";
import {Session} from "@/model/userdata/courses/Session";

export const useSessionStore = defineStore('sessions', {
  state: () => ({
    sessions: [] as Session[]
  }),
  actions: {
    addSession(session: Session) {

    },
    deleteSession(id: string) {

    },
    getSession(id: string): Session {

    },
    getAllSessions(): Session[] {

    }
  }
})
