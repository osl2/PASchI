import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";

export class SeatArrangementController {

  private static controller: SeatArrangementController = new SeatArrangementController();
  private seatArrangementStore = useSeatArrangementStore();

  private constructor() {
  }

  static getSeatArrangementController(): SeatArrangementController {
    return SeatArrangementController.controller;
  }

  createSeatArrangement(name: string, roomId: string) {

  }

  deleteSeatArrangement(id: string) {

  }

  getSeatArrangement(id: string): SeatArrangement | undefined {
    return this.seatArrangementStore.getSeatArrangement(id);
  }

  addMapping(arrangementId: string, chairId: string, studentId: string) {

  }

  deleteMapping(arrangementId: string, chairId: string) {

  }
}
