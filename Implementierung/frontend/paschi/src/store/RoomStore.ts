import {defineStore} from "pinia";
import {Room} from "@/model/userdata/rooms/Room";

export const useRoomStore = defineStore('rooms', {
  state: () => ({
    rooms: [] as Room[],
    nextId: 0
  }),
  actions: {
    addRoom(room: Room): string {
      this.rooms.push(room);
      return room.getId;
    },
    deleteRoom(id: string) {
      this.rooms.forEach((element, index) => {
        if (element.getId === id) {
          this.rooms.splice(index, 1);
        }
      });
    },
    getRoom(id: string): Room | undefined {
      let room: Room;
      this.rooms.forEach((element) => {
        if (element.getId === id) {
          // @ts-ignore
          room = element;
        }
      });
      // @ts-ignore
      if (room !== undefined) {
        return room;
      }
      return undefined;
    },
    getAllRooms(): Room[] {
      // @ts-ignore
      return this.rooms;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
