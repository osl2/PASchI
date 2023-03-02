import {defineStore} from "pinia";
import {Chair} from "@/model/userdata/rooms/Chair";
import {Table} from "@/model/userdata/rooms/Table";

export const useRoomObjectStore = defineStore('roomObjects', {
  state: () => ({
    chairs: [] as Chair[],
    tables: [] as Table[],
    nextId: 0
  }),
  actions: {
    addChair(chair: Chair): string {
      this.chairs.push(chair);
      return chair.getId;
    },
    addTable(table: Table): string {
      this.tables.push(table);
      return table.getId;
    },
    getChair(id: string): Chair | undefined {
      for (const chair of this.chairs) {
        if (chair.getId === id) {
          return <Chair> chair;
        }
      }
      return undefined;
    },
    getChairByTimeCreated(time: string): Chair | undefined {
      for (const chair of this.chairs) {
        if (chair.createdAt.substring(0, 23) === time.substring(0, 23)) {
          return <Chair> chair;
        }
      }
      return undefined;
    },
    getTableByTimeCreated(time: string): Table | undefined {
      for (const table of this.tables) {
        if (table.createdAt.substring(0, 23) === time.substring(0, 23)) {
          return <Table> table;
        }
      }
      return undefined;
    },
    deleteRoomObject(id: string) {
      this.chairs.forEach((element, index) => {
        if (element.getId === id) {
          this.chairs.splice(index, 1);
        }
      });
      this.tables.forEach((element, index) => {
        if (element.getId === id) {
          this.tables.splice(index, 1);
        }
      });
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
