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
    addChair(chair: Chair) {
      this.chairs.push(chair);
    },
    addTable(table: Table) {
      this.tables.push(table);
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
