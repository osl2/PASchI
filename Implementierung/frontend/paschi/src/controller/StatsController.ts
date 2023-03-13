import {StudentController} from "@/controller/StudentController";
import {SessionController} from "@/controller/SessionController";
import {CourseController} from "@/controller/CourseController";
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

    const categories: Map<string, number> = new Map<string, number>();
    let avgQuality: number;
    let numInteractions = 0;
    let numCategories = 0;
    let qualitySum = 0;

    const interactions = student.interactions.filter(interaction =>
      (interaction.category.name.toLowerCase() === CATEGORY_NAME) || interaction.fromParticipant.getId === studentId);

    for (const interaction of interactions) {
      // Anzahl und absolute Häufigkeit der Kategorien zählen.
      const category = interaction.category;
      const value = categories.get(category.name);
      if (value) {
        categories.set(category.name, value + 1);
      } else {
        categories.set(category.name, 1);
      }
      ++numCategories;

      // Summe der Qualitäten aller Interaktionen.
      const quality = interaction.category.getQuality();
      if (quality) {
        qualitySum += this.getQualityAsNumber(quality);
        ++numInteractions;
      }
    }

    avgQuality = +(qualitySum / numInteractions).toFixed(1);

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
  getCourseStats(courseId: string): any[] | undefined {
    const course = CourseController.getCourseController().getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    let categories: Map<string, number> = new Map<string, number>();
    let students: Map<string, [number, number, number, number]> = new Map<string, [number, number, number, number]>();
    let participation: Map<string, number> = new Map<string, number>();
    let numCategories = 0;

    for (const session of course.sessions) {
      // Anzahl und absolute Häufigkeit der Kategorien zählen.
      // Statistiken der Teilnehmer sammeln.
      let interactionStats = this.getInteractionStats(session, categories, students, numCategories);
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
    }

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
    let sessionStats = this.getInteractionStats(session, categories, students, numCategories);
    if (sessionStats) {
      categories = sessionStats[0];
      //numCategories = sessionStats[1];
      students = sessionStats[2];
    }

    // Beteiligunsquote berechnen.
    let numStudentsInCourse = 0;
    session.seatArrangement.seatMap.forEach(participant =>
      participant.isTeacher() ? 0 : ++numStudentsInCourse);
    let participants = 0;
    students.forEach((value) => value[0] > 0 ? ++participants : 0);
    const participantionRate = +((participants / numStudentsInCourse) * 100).toFixed(0);

    const statsArray = this.getTopStudents(students);
    statsArray.push(categories);
    statsArray.push(participantionRate);

    return statsArray;
  }


  private getInteractionStats(session: Session, categories: Map<string, number>,
                              students: Map<string, [number, number, number, number]>,
                              numCategories: number): any[] {

    for (const interaction of session.interactions) {
      // Anzahl und absolute Häufigkeit der Kategorien zählen.
      if (interaction.fromParticipant.isTeacher() || !interaction.fromParticipant.visible) {
        continue;
      }
      let category = interaction.category;
      let value = categories.get(category.name);

      if (value != undefined) {
        categories.set(category.name, value + 1);
      } else {
        categories.set(category.name, 1);
      }
      ++numCategories;

      const from = interaction.fromParticipant;
      const to = interaction.toParticipant;
      let valueArray = students.get(from.getId);
      let valueArrayTo;
      if (!to.isTeacher()) {
        valueArrayTo = students.get(to.getId);
      }
      let quality = interaction.category.getQuality();
      let disturbance = interaction.category.name.toLowerCase() === CATEGORY_NAME;

      // Schülerstatistiken berechnen.
      if (valueArray != undefined) {
        if (disturbance) {
          ++valueArray[3];
          if (valueArrayTo) {
            ++valueArrayTo[3];
          } else if (!to.isTeacher()) {
            students.set(to.getId, [0, 0, 0, 1]);
          }
        } else {
          ++valueArray[0];
          if (quality != undefined) {
            valueArray[1]++;
            valueArray[2] += this.getQualityAsNumber(quality);
          }
        }
        students.set(from.getId, valueArray);
      } else {
        if (quality != undefined) {
          students.set(from.getId, [1, 1, this.getQualityAsNumber(quality), 0]);
        } else if (disturbance) {
          students.set(from.getId, [0, 0, 0, 1]);
          if (valueArrayTo) {
            ++valueArrayTo[3];
          } else if (!to.isTeacher()) {
            students.set(to.getId, [0, 0, 0, 1]);
          }
        } else {
          students.set(from.getId, [1, 0, 0, 0]);
        }
      }
    }

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
      if (value[1] != 0) {
        topInteractions.push([value[0], value[1]]);
      }
    });

    // Schüler nach durchschnittlicher Qualität absteigend sortieren.
    studentStats.sort((a, b) => {
      return (a[2] >= b[2]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number, number]) => {
      if (value[2] != 0) {
        topQuality.push([value[0], value[2]]);
      }
    });

    // Schüler nach Anzahl der Interaktionen aufsteigend sortieren.
    studentStats.sort((a, b) => {
      return (a[1] <= b[1]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number, number]) => {
      if (value[1] != 0) {
        bottomInteractions.push([value[0], value[1]]);
      }
    });

    // Schüler nach durchschnittlicher Qualität aufsteigend sortieren.
    studentStats.sort((a, b) => {
      return (a[2] <= b[2]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number, number]) => {
      if (value[2] != 0) {
        bottomQuality.push([value[0], value[2]]);
      }
    });

    // Schüler nach Anzahl der Störungen absteigend sortieren.
    studentStats = studentStats.sort((a, b) => {
      return (a[3] <= b[3]) ? 1 : -1;
    });
    studentStats.forEach((value: [string, number, number, number]) => {
      if (value[3] != 0) {
        topDisturbance.push([value[0], value[3]]);
      }
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
