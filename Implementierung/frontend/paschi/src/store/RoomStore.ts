import {defineStore} from "pinia";
import {Room} from "@/model/userdata/rooms/Room";

export const useRoomStore = defineStore('rooms', {
  state: () => ({
    rooms: [] as Room[]
  }),
  actions: {
    addRoom(room: Room) {

    },
    deleteRoom(id: string) {

    },
    getRoom(id: string): Room {

    },
    getAllRooms(): Room[] {

    }
  }
})
