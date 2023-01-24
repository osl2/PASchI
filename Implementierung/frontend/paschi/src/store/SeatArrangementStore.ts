import {defineStore} from "pinia";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";

export const useSeatArrangementStore = defineStore('seatArrangements', {
  state: () => ({
    seatArrangements: [] as SeatArrangement[],
    nextId: 0
  }),
  actions: {
    addSeatArrangement(arrangement: SeatArrangement) {
      this.seatArrangements.push(arrangement);
    },
    deleteSeatArrangement(id: string) {
      this.seatArrangements.forEach((element, index) => {
        if (element.getId === id) {
          this.seatArrangements.splice(index, 1);
        }
      });
    },
    getSeatArrangement(id: string): SeatArrangement | undefined {
      this.seatArrangements.forEach((element) => {
        if (element.getId === id) {
          return element;
        }
      });
      return undefined;
    },
    getAllSeatArrangements(): SeatArrangement[] {
      // @ts-ignore
      return this.seatArrangements;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
