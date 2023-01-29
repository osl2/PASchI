import {defineStore} from "pinia";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";

export const useRoomObjectStore = defineStore('roomObjects', {
  state: () => ({
    objects: [] as RoomObject[],
    nextId: 0
  }),
  actions: {
    getNextId(): number {
      return this.nextId++;
    },
    getRoomObject(id: string): RoomObject | undefined {
      this.objects.forEach((element) => {
        if (element.getId === id) {
          return element;
        }
      });
      return undefined;
    }
  }
})
