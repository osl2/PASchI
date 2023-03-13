import {defineStore} from "pinia";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";

export const useSeatArrangementStore = defineStore('seatArrangements', {
  state: () => ({
    seatArrangements: [] as SeatArrangement[],
    nextId: 0
  }),
  actions: {
    addSeatArrangement(arrangement: SeatArrangement): string {
      this.seatArrangements.push(arrangement);
      return arrangement.getId;
    },
    deleteSeatArrangement(id: string) {
      this.seatArrangements.forEach((element, index) => {
        if (element.getId === id) {
          this.seatArrangements.splice(index, 1);
        }
      });
    },
    getSeatArrangement(id: string): SeatArrangement | undefined {
      for (const arrangement of this.seatArrangements) {
        if (arrangement.getId === id) {
          return <SeatArrangement>arrangement;
        }
      }
      return undefined;
    },
    getAllSeatArrangements(): SeatArrangement[] {
      return <SeatArrangement[]>this.seatArrangements;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
