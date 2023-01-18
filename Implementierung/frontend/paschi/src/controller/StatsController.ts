export class StatsController {

  private static controller: StatsController = new StatsController();

  private constructor() {
  }

  static getStatsController(): StatsController {
    return StatsController.controller;
  }

  getStudentStats(studentId: number) {

  }

  getCourseStats(courseId: number) {

  }

  getSessionStats(sessionId: number) {

  }

  getInteractionMap(sessionId: number) {
    
  }
}
