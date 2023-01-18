export class StatsController {

  private static controller: StatsController = new StatsController();

  private constructor() {
  }

  static getStatsController(): StatsController {
    return StatsController.controller;
  }

  getStudentStats(studentId: string) {

  }

  getCourseStats(courseId: string) {

  }

  getSessionStats(sessionId: string) {

  }

  getInteractionMap(sessionId: string) {

  }
}
