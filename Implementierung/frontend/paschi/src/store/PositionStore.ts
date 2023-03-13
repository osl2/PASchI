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
      for (const position of this.positions) {
        if (position.getId === id) {
          return <Position>position;
        }
      }
      return undefined;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
