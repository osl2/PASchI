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
      let arrangement: SeatArrangement;
      this.seatArrangements.forEach((element) => {
        if (element.getId === id) {
          // @ts-ignore
          arrangement = element;
        }
      });
      // @ts-ignore
      if (arrangement !== undefined) {
        return arrangement;
      }
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
