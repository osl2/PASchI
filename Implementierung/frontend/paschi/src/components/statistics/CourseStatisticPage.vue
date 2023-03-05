<template>
  <navigation-bar>
    <v-app-bar-title>
      Kursstatistiken des Kurses {{ courseName + " (" + courseSubject + ")" }}
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn
        variant="flat"
        color="green"
        rounded
        prepend-icon="mdi mdi-download"
        @click="saveStatisticClick"
      >
        Statistiken herunterladen</v-btn
      >
    </template>
  </navigation-bar>
  <v-main>
    <SideMenu />
    <div id="content">
      <v-container fluid>
        <v-row justify="space-around" align-content="stretch">
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="ma-2">
                  durchschnittliche Beteiligungsquote im Zeitverlauf
                  <v-spacer />
                </v-row>
              </v-card-title>
              <v-card-item
                v-if="stats !== undefined && involvementKeys.length !== 0"
              >
                <canvas id="involvementChart" />
              </v-card-item>
              <v-card-item v-else> Keine Daten verfügbar. </v-card-item>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="ma-2">
                  Aufschlüsselung der Interaktionen nach Kategorien
                  <v-spacer />
                </v-row>
              </v-card-title>
              <v-card-item
                v-if="stats !== undefined && categoryKeys.length !== 0"
              >
                <canvas id="categoryChart" />
              </v-card-item>
              <v-card-item v-else> Keine Daten verfügbar. </v-card-item>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="space-around" align-content="stretch">
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="ma-2">
                  Top 5 der Schüler nach Anzahl Interaktionen
                  <v-spacer />
                </v-row>
              </v-card-title>
              <v-card-item v-if="stats !== undefined && stats[0].length !== 0">
                <v-list>
                  <v-list-item v-for="studentId in top5InteractionArray">
                    <v-list-item-title>
                      {{
                        studentController.getStudent(studentId[0])?.firstName +
                        " " +
                        studentController.getStudent(studentId[0])?.lastName
                      }}: {{ studentId[1] }} Interaktionen
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-item>
              <v-card-item v-else> Keine Daten verfügbar. </v-card-item>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="ma-2">
                  Top 5 Schüler nach Anzahl Störungen
                  <v-spacer />
                </v-row>
              </v-card-title>
              <v-card-item v-if="stats !== undefined && stats[4].length !== 0">
                <v-list>
                  <v-list-item v-for="studentId in top5DisturberArray">
                    <v-list-item-title>
                      {{
                        studentController.getStudent(studentId[0])?.firstName +
                        " " +
                        studentController.getStudent(studentId[0])?.lastName
                      }}: {{ studentId[1] }} Störungen
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-item>
              <v-card-item v-else> Keine Daten verfügbar. </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import Chart from "chart.js/auto";
import { StatsController } from "@/controller/StatsController";
import { StudentController } from "@/controller/StudentController";
import { CourseController } from "@/controller/CourseController";

export default defineComponent({
  name: "CourseStatisticPage",
  components: { SideMenu, NavigationBar },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const statsController = StatsController.getStatsController();
    const studentController = StudentController.getStudentConroller();
    const courseController = CourseController.getCourseController();
    const course = courseController.getCourse(props.courseId);

    let top5InteractionArray: Map<string, number> | any[] = [];
    let top5DisturberArray: Map<string, number> | any[] = [];

    const courseName = course?.name;
    const courseSubject = course?.subject;

    const downloadElementCategoryChart = document.createElement("a");
    const downloadElementInvolvementChart = document.createElement("a");

    const stats = statsController.getCourseStats(props.courseId);

    if (stats !== undefined) {
      top5InteractionArray = stats[0];
      top5DisturberArray = stats[4];
    }
    let categoryMap = getCategoryMap();
    let categoryKeys = Array.from(categoryMap!.keys());
    let categoryValues = Array.from(categoryMap!.values());

    let involvementMap = getInvolvementMap();
    let involvementKeys = Array.from(involvementMap!.keys());
    let involvementValues = Array.from(involvementMap!.values());
    console.log(involvementKeys);
    console.log(involvementValues);

    function getCategoryMap() {
      if (stats !== undefined) {
        return stats[5] as Map<string, number>;
      }
    }

    function getInvolvementMap() {
      if (stats !== undefined) {
        return stats[6] as Map<string, number>;
      }
    }

    function saveStatisticClick() {
      downloadElementInvolvementChart.click();
      downloadElementCategoryChart.click();
    }
    onMounted(() => {
      if (document.getElementById("categoryChart") == null) {
        return;
      }
      const categoryChartId = document.getElementById(
        "categoryChart"
      ) as HTMLCanvasElement;
      const involvementChartId = document.getElementById(
        "involvementChart"
      ) as HTMLCanvasElement;
      // const top5InteractionChartId = document.getElementById('top5InteractionChart') as HTMLCanvasElement;
      // const top5DisturberChartId = document.getElementById('top5DisturberChart') as HTMLCanvasElement;

      if (stats == undefined) {
        console.log("stats could not be loaded");
        return;
      }

      const involvementChartData = {
        labels:
          //['5.12 dummy', '6.12 dummy', '9.12 dummy', '10.12 dummy', '11.12 dummy'],
          involvementKeys,
        datasets: [
          {
            label: "Anzahl",
            data:
              //[5,3,2,1,4],
              involvementValues,
          },
        ],
      };

      const categoryChartData = {
        labels:
          // ['Störungsdummy', 'Antwortdummy', 'Fragendummy'],
          categoryKeys,
        datasets: [
          {
            label: "Anzahl",
            data:
              //[5,3,2],
              categoryValues,
          },
        ],
      };

      const involvementChart = new Chart(involvementChartId, {
        type: "line",
        data: involvementChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: "rgb(0,0,0)",
              },
            },
          },
          animation: {
            onComplete: buildInvolvementChart,
          },
        },
      });

      const categoryChart = new Chart(categoryChartId, {
        type: "pie",
        data: categoryChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: "rgb(0,0,0)",
              },
            },
          },
          animation: {
            onComplete: buildCategoryChart,
          },
        },
      });

      function buildCategoryChart() {
        downloadElementCategoryChart.href = categoryChart.toBase64Image();
        downloadElementCategoryChart.download = "Kategorienaufschlüsselung.png";
      }
      function buildInvolvementChart() {
        downloadElementInvolvementChart.href = involvementChart.toBase64Image();
        downloadElementInvolvementChart.download = "Beteiligungsverlauf.png";
      }

      categoryChart.update();
      involvementChart.update();
    });
    return {
      statsController,
      stats,
      studentController,
      courseName,
      courseSubject,
      saveStatisticClick,
      top5InteractionArray,
      top5DisturberArray,
      categoryKeys,
      involvementKeys,
    };
  },
});
</script>

<style scoped></style>
