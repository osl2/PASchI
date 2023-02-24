import {defineStore} from "pinia";
import {Position} from "@/model/userdata/rooms/Position";

export const usePositionStore = defineStore('positions', {
  state: () => ({
    positions: [] as Position[],
    nextId: 0
  }),
  actions: {
    addPosition(positions: Position) {
      this.positions.push(positions);
    },
    deletePosition(id: string) {
      this.positions.forEach((element, index) => {
        if (element.getId === id) {
          this.positions.splice(index, 1);
        }
      });
    },
    getPosition(id: string): Position | undefined {
      let position: Position;
      this.positions.forEach((element) => {
        if (element.getId === id) {
          // @ts-ignore
          position = element;
        }
      });
      // @ts-ignore
      if (position !== undefined) {
        return position;
      }
      return undefined;
    },
    getAllPositions(): Position[] {
      // @ts-ignore
      return this.positions;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
