export class SeatArrangementController {

  private static controller: SeatArrangementController = new SeatArrangementController();

  private constructor() {
  }

  static getSeatArrangementController(): SeatArrangementController {
    return SeatArrangementController.controller;
  }

  createSeatArrangement(name: string, roomId: number) {

  }

  addMapping(arrangementId: number, chairId: number, studentId: number) {

  }

  deleteMapping(arrangementId: number, chairId: number) {

  }
}
