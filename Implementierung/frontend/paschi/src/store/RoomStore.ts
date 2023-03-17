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
      for (const room of this.rooms) {
        if (room.getId === id) {
          return <Room>room;
        }
      }
      return undefined;
    },
    getAllRooms(): Room[] {
      return <Room[]> this.rooms;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
