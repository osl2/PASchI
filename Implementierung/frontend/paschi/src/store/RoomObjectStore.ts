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
    getTable(id: string): Table | undefined {
      for (const table of this.tables) {
        if (table.getId === id) {
          return <Table> table;
        }
      }
      return undefined;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
