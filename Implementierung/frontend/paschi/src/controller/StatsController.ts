import {StudentController} from "@/controller/StudentController";
import {SessionController} from "@/controller/SessionController";
import {CourseController} from "@/controller/CourseController";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {Session} from "@/model/userdata/courses/Session";

export class StatsController {

  private static controller: StatsController = new StatsController();
  private studentController = StudentController.getStudentConroller();
  private sessionController = SessionController.getSessionController();
  private courseController = CourseController.getCourseController();

  private constructor() {
  }

  static getStatsController(): StatsController {
    return StatsController.controller;
  }

  /*
  Array [
   1. Map(kategorieId, prozent)
   2. durchschnittliche Qualität
   ]
   */
  getStudentStats(studentId: string): any[] | undefined {
    const student = this.studentController.getStudent(studentId);
    if (student == undefined) {
      return undefined;
    }

    let categories: Map<string, number> = new Map<string, number>();
    let avgQuality;
    let numInteractions = 0;
    let numCategories = 0;
    let qualitySum = 0;

    student.interactions.forEach((interaction: Interaction) => {
      let category = interaction.category;
      let value = categories.get(category.getId);
      if (value != undefined) {
        categories.set(category.getId, value + 1);
      } else {
        categories.set(category.getId, 1);
      }
      ++numCategories;

      let quality = interaction.category.getQuality();
      if (quality != undefined) {
        qualitySum += quality + 1;
        ++numInteractions;
      }
    });

    categories.forEach((value: number, category: string) => {
      categories.set(category, (value / numCategories) * 100);
    });
    avgQuality = qualitySum / numInteractions;

    const statsArray = [];
    statsArray.push(categories);
    statsArray.push(avgQuality);

    return statsArray;
  }

  /*
  Array [
   1. Map(kategorieId, prozent)
   2. Map(datum, beteiligunsquote)
   3. top 5 schüler arary
   4. top 5 störer array
  ]
   */
  getCourseStats(courseId: string): (Map<string, number> | any[])[] | undefined {
    const course = this.courseController.getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    let categories: Map<string, number> = new Map<string, number>();
    let students: Map<string, [number, number, number]> = new Map<string, [number, number, number]>();
    let numCategories = 0;

    course.sessions.forEach((session: Session) => {
      session.interactions.forEach((interaction: Interaction) => {
        let category = interaction.category;
        let value = categories.get(category.getId);

        if (value != undefined) {
          categories.set(category.getId, value + 1);
        } else {
          categories.set(category.getId, 1);
        }
        ++numCategories;

        let from = interaction.fromParticipant;
        let valueArray = students.get(from.getId);
        let quality = interaction.category.getQuality();

        if (valueArray != undefined) {
          valueArray[0]++;
          if (quality != undefined) {
            valueArray[1]++;
            valueArray[2] += quality + 1;
          }
          students.set(from.getId, valueArray);
        } else {
          if (quality != undefined) {
            students.set(from.getId, [1, 1, quality + 1]);
          } else {
            students.set(from.getId, [1, 0, 0]);
          }
        }
      });
    });

    // let studentStats: Map<string, [number, number]> = new Map<string, [number, number]>();
    let studentStats: any[] = [];
    students.forEach((value: [number, number, number], id: string) => {
      let numInteractions = value[0];
      let numQualities = value[1];
      let qualitySum = value[2];

      // studentStats.set(id, [numInteractions, qualitySum / numQualities]);
      studentStats.push([id, numInteractions, qualitySum / numQualities]);
    });

    let topInteractions: any[] = [];
    let topQuality: any[] = [];
    let bottomInteractions: any[] = [];
    let bottomQuality: any[] = [];

    studentStats.sort((a, b) => {
      return (a[1] >= b[1]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number]) => {
      topInteractions.push(value[0], value[1]);
    });

    studentStats.sort((a, b) => {
      return (a[2] >= b[2]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number]) => {
      topQuality.push(value[0], value[2]);
    });

    studentStats.sort((a, b) => {
      return (a[1] <= b[1]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number]) => {
      bottomInteractions.push(value[0], value[1]);
    });

    studentStats.sort((a, b) => {
      return (a[2] <= b[2]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number]) => {
      bottomQuality.push(value[0], value[2]);
    });

    categories.forEach((value: number, category: string) => {
      categories.set(category, (value / numCategories) * 100);
    });

    const statsArray = [];
    statsArray.push(categories);
    // TODO beteiligunsquote pro Session
    // statsArray.push();
    statsArray.push(topInteractions);
    statsArray.push(topQuality);
    statsArray.push(bottomInteractions);
    statsArray.push(bottomQuality);

    return statsArray;
  }

  /*
  Array [
   1. Map(kategorieId, prozent)
   2. beteiligung
   3. top 5 schüler arary
   4. top 5 störer array
   ]
   */
  getSessionStats(sessionId: string): [] | undefined {
    const session = this.sessionController.getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }
  }

  getInteractionMap(sessionId: string) {

  }
}
