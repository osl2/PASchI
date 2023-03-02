import {StudentController} from "@/controller/StudentController";
import {SessionController} from "@/controller/SessionController";
import {CourseController} from "@/controller/CourseController";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {Session} from "@/model/userdata/courses/Session";
import {Quality} from "@/model/userdata/interactions/Quality";

const CATEGORY_NAME = "störung";

export class StatsController {

  private static controller: StatsController = new StatsController();

  private constructor() {
  }

  static getStatsController(): StatsController {
    return this.controller;
  }

  /**
   Array [
   1. Map(kategorieId, prozent)
   2. Durchschnittliche Qualität
   ]
   */
  getStudentStats(studentId: string): any[] | undefined {
    const student = StudentController.getStudentConroller().getStudent(studentId);
    if (student == undefined) {
      return undefined;
    }

    let categories: Map<string, number> = new Map<string, number>();
    let avgQuality;
    let numInteractions = 0;
    let numCategories = 0;
    let qualitySum = 0;

    student.interactions.forEach((interaction: Interaction) => {
      // Anzahl und absolute Häufigkeit der Kategorien zählen.
      let category = interaction.category;
      let value = categories.get(category.name);
      if (value != undefined) {
        categories.set(category.name, value + 1);
      } else {
        categories.set(category.name, 1);
      }
      ++numCategories;

      // Summe der Qualitäten aller Interaktionen.
      let quality = interaction.category.getQuality();
      if (quality != undefined) {
        qualitySum += this.getQualityAsNumber(quality) + 1;
        ++numInteractions;
      }
    });

    avgQuality = qualitySum / numInteractions;

    const statsArray = [];
    statsArray.push(categories);
    statsArray.push(avgQuality);

    return statsArray;
  }

  /**
   Array [
   1. Top 5 Schüler Array nach Anzahl Interaktionen
   2. Top 5 Schüler Array nach durchschnittlicher Qualität
   3. Bottom 5 Schüler Array nach Anzahl Interaktionen
   4. Bottom 5 Schüler Array nach durchschnittlicher Qualität
   5. Top 5 Störer Array
   6. Map(kategorieId, prozent) über alle Sessions
   7. Map(datum, Beteiligunsquote)
   ]
   */
  getCourseStats(courseId: string): (Map<string, number> | any[])[] | undefined {
    const course = CourseController.getCourseController().getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    let categories: Map<string, number> = new Map<string, number>();
    let students: Map<string, [number, number, number, number]> = new Map<string, [number, number, number, number]>();
    let participation: Map<string, number> = new Map<string, number>();
    let numCategories = 0;

    course.sessions.forEach((session: Session) => {
      // Anzahl und absolute Häufigkeit der Kategorien zählen.
      // Statistiken der Teilnehmer sammeln.
      let interactionStats = this.getInteractionStats(session.getId, categories, students, numCategories);
      if (interactionStats != undefined) {
        categories = interactionStats[0];
        numCategories = interactionStats[1];
        students = interactionStats[2];
      }

      // Beteiligunsquote der Sitzung.
      let sessionStats = this.getSessionStats(session.getId);
      if (sessionStats != undefined) {
        participation.set(session.date, sessionStats[6]);
      }
    });

    /*// Relative Häufigkeit der Kategorien berechnen.
    categories.forEach((value: number, category: string) => {
      categories.set(category, (value / numCategories) * 100);
    });*/

    const statsArray = this.getTopStudents(students);
    statsArray.push(categories);
    statsArray.push(participation);

    return statsArray;
  }

  /**
   Array [
   1. Top 5 Schüler Array nach Anzahl Interaktionen
   2. Top 5 Schüler Array nach durchschnittlicher Qualität
   3. Bottom 5 Schüler Array nach Anzahl Interaktionen
   4. Bottom 5 Schüler Array nach durchschnittlicher Qualität
   5. Top 5 Störer Array
   6. Map(kategorieId, prozent)
   7. Beteiligungsquote
   ]
   */
  getSessionStats(sessionId: string): any[] | undefined {
    const session = SessionController.getSessionController().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    let categories: Map<string, number> = new Map<string, number>();
    let students: Map<string, [number, number, number, number]> = new Map<string, [number, number, number, number]>();
    let numCategories = 0;

    // Anzahl und absolute Häufigkeit der Kategorien zählen.
    // Statistiken der Teilnehmer sammeln.
    let sessionStats = this.getInteractionStats(sessionId, categories, students, numCategories);
    if (sessionStats != undefined) {
      categories = sessionStats[0];
      //numCategories = sessionStats[1];
      students = sessionStats[2];
    }

    // Beteiligunsquote berechnen.
    let numStudentsInCourse = 0;
    session.course.participants.forEach(() => ++numStudentsInCourse);
    let participants = 0;
    students.forEach(() => {
      ++participants
    });
    let participantionRate = (participants / numStudentsInCourse) * 100;

    /*  // Relative Häufigkeit der Kategorien berechnen.
      categories.forEach((value: number, category: string) => {
        categories.set(category, (value / numCategories) * 100);
      });*/

    const statsArray = this.getTopStudents(students);
    statsArray.push(categories);
    statsArray.push(participantionRate);

    return statsArray;
  }


  private getInteractionStats(sessionId: string, categories: Map<string, number>,
                              students: Map<string, [number, number, number, number]>,
                              numCategories: number): any[] | undefined {
    let session = SessionController.getSessionController().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    session.interactions.forEach((interaction: Interaction) => {
      // Anzahl und absolute Häufigkeit der Kategorien zählen.
      let category = interaction.category;
      let value = categories.get(category.name);

      if (value != undefined) {
        categories.set(category.name, value + 1);
      } else {
        categories.set(category.name, 1);
      }
      ++numCategories;

      let from = interaction.fromParticipant;
      let valueArray = students.get(from.getId);
      let quality = interaction.category.getQuality();
      let disturbance = interaction.category.name.toLowerCase() === CATEGORY_NAME;

      // Schülerstatistiken berechnen.
      if (valueArray != undefined) {
        ++valueArray[0];
        if (quality != undefined) {
          valueArray[1]++;
          valueArray[2] += this.getQualityAsNumber(quality) + 1;
        }
        if (disturbance) {
          ++valueArray[3];
        }
        students.set(from.getId, valueArray);
      } else {
        if (quality != undefined && disturbance) {
          students.set(from.getId, [1, 1, this.getQualityAsNumber(quality) + 1, 1]);
        } else if (disturbance) {
          students.set(from.getId, [1, 0, 0, 1]);
        } else {
          students.set(from.getId, [1, 0, 0, 0]);
        }
      }
    });

    return [categories, numCategories, students];
  }

  private getTopStudents(students: Map<string, [number, number, number, number]>): any[] {
    let studentStats: any[] = [];

    students.forEach((value: [number, number, number, number], id: string) => {
      let numInteractions = value[0];
      let numQualities = value[1];
      let qualitySum = value[2];
      let disturbance = value[3];

      studentStats.push([id, numInteractions, qualitySum / numQualities, disturbance]);
    });

    let topInteractions: any[] = [];
    let topQuality: any[] = [];
    let bottomInteractions: any[] = [];
    let bottomQuality: any[] = [];
    let topDisturbance: any[] = [];

    // Schüler nach Anzahl der Interaktionen absteigend sortieren.
    studentStats = studentStats.sort((a, b) => {
      return (a[1] <= b[1]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number, number]) => {
      topInteractions.push([value[0], value[1]]);
    });

    // Schüler nach durchschnittlicher Qualität absteigend sortieren.
    studentStats.sort((a, b) => {
      return (a[2] >= b[2]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number, number]) => {
      topQuality.push([value[0], value[2]]);
    });

    // Schüler nach Anzahl der Interaktionen aufsteigend sortieren.
    studentStats.sort((a, b) => {
      return (a[1] <= b[1]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number, number]) => {
      bottomInteractions.push([value[0], value[1]]);
    });

    // Schüler nach durchschnittlicher Qualität aufsteigend sortieren.
    studentStats.sort((a, b) => {
      return (a[2] <= b[2]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number, number]) => {
      bottomQuality.push([value[0], value[2]]);
    });

    // Schüler nach Anzahl der Störungen absteigend sortieren.
    studentStats = studentStats.sort((a, b) => {
      return (a[3] <= b[3]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number, number]) => {
      topDisturbance.push([value[0], value[3]]);
    });

    return [topInteractions, topQuality, bottomInteractions, bottomQuality, topDisturbance];
  }

  private getQualityAsNumber(quality: Quality): number {
    switch (quality) {
      case Quality.ONE_STAR:
        return 1;
      case Quality.TWO_STAR:
        return 2;
      case Quality.THREE_STAR:
        return 3;
      case Quality.FOUR_STAR:
        return 4;
      case Quality.FIVE_STAR:
        return 5;
    }
  }
}
