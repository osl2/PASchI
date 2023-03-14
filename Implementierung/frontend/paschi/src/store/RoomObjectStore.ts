import {defineStore} from "pinia";
import {Chair} from "@/model/userdata/rooms/Chair";
import {Table} from "@/model/userdata/rooms/Table";
import {Position} from "@/model/userdata/rooms/Position";

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
          return <Chair>chair;
        }
      }
      return undefined;
    },
    getChairByTimeCreatedAndPosition(time: string, pos: Position): Chair | undefined {
      for (const chair of this.chairs) {
        if (chair.createdAt.substring(0, 23) === time.substring(0, 23)
          && chair.position.xCoordinate == pos.xCoordinate && chair.position.yCoordinate == pos.yCoordinate) {
          return <Chair>chair;
        }
      }
      return undefined;
    },
    getTableByTimeCreatedAndPosition(time: string, pos: Position): Table | undefined {
      for (const table of this.tables) {
        if (table.createdAt.substring(0, 23) === time.substring(0, 23)
          && table.position.xCoordinate == pos.xCoordinate && table.position.yCoordinate == pos.yCoordinate) {
          return <Table>table;
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
