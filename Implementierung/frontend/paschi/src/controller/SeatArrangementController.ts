export class SeatArrangementController {

  private static controller: SeatArrangementController = new SeatArrangementController();

  private constructor() {
  }

  static getSeatArrangementController(): SeatArrangementController {
    return SeatArrangementController.controller;
  }

  createSeatArrangement(name: string, roomId: string) {

  }

  addMapping(arrangementId: string, chairId: string, studentId: string) {

  }

  deleteMapping(arrangementId: string, chairId: string) {

  }
}
