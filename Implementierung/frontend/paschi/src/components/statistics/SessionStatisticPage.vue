<template>
  <navigation-bar>
    <v-app-bar-title>
      Sitzungsstatistiken der Sitzung am {{ sessionDate }} des Kurses
      {{ sessionCourse + " (" + sessionCourseSubject + ")" }}
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn
        variant="flat"
        color="green"
        rounded
        prepend-icon="mdi mdi-download"
        @click="saveStatisticClick"
      >
        Statistiken herunterladen
      </v-btn>
    </template>
  </navigation-bar>
  <v-main>
    <SideMenu/>
    <BottomBar />
    <div id="content">
      <v-container fluid>
        <v-row justify="space-around" align-content="stretch">
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="text-wrap ma-2">
                  Aufschlüsselung der Interaktionen nach Kategorien
                  <v-spacer/>
                </v-row>
              </v-card-title>
              <v-card-item v-if="stats !== undefined && keys.length !== 0">
                <canvas id="categoryChart"/>
              </v-card-item>
              <v-card-item v-else> Keine Daten verfügbar.</v-card-item>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="text-wrap ma-2">
                  Beteiligungsqoute
                  <v-spacer/>
                </v-row>
              </v-card-title>
              <v-card-item
                v-if="statsController.getSessionStats(sessionId) !== undefined"
              >
                {{ statsController.getSessionStats(sessionId)[6] }} %
              </v-card-item>
              <v-card-item v-else> Keine Daten verfügbar.</v-card-item>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="space-around" align-content="stretch">
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="text-wrap ma-2">
                  Top 5 der Schüler nach Anzahl Interaktionen
                  <v-spacer/>
                </v-row>
              </v-card-title>
              <v-card-item v-if="stats !== undefined && stats[0].length !== 0">
                <v-list max-height="500">
                  <v-row class="text-wrap ma-2" v-for="studentId in top5InteractionArray"
                  >{{
                      studentController.getStudent(studentId[0])?.firstName +
                      " " +
                      studentController.getStudent(studentId[0])?.lastName +
                      ": " + studentId[1]}}
                    <v-spacer />
                    <v-btn
                      class="ml-2"
                      variant="tonal"
                      color="primary"
                      @click="showStatisticsClick(studentId[0])"
                    >
                      <v-icon> fas fa-chart-line </v-icon>
                    </v-btn>
                  </v-row>
                </v-list>
              </v-card-item>
              <v-card-item v-else> Keine Daten verfügbar.</v-card-item>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="text-wrap ma-2">
                  Top 5 Schüler nach Anzahl Störungen
                  <v-spacer/>
                </v-row>
              </v-card-title>
              <v-card-item v-if="stats !== undefined && stats[4].length !== 0">
                <v-list max-height="500">
                  <v-row class="text-wrap ma-2" v-for="studentId in top5DisturberArray"
                  >{{
                      studentController.getStudent(studentId[0])?.firstName +
                      " " +
                      studentController.getStudent(studentId[0])?.lastName +
                      ": " + studentId[1]}}
                    <v-spacer />
                    <v-btn
                      class="ml-2"
                      variant="tonal"
                      color="primary"
                      @click="showStatisticsClick(studentId[0])"
                    >
                      <v-icon> fas fa-chart-line </v-icon>
                    </v-btn>
                  </v-row>
                </v-list>
              </v-card-item>
              <v-card-item v-else> Keine Daten verfügbar.</v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-main>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import Chart from "chart.js/auto";
import {StatsController} from "@/controller/StatsController";
import {StudentController} from "@/controller/StudentController";
import {SessionController} from "@/controller/SessionController";
import router from "@/plugins/router";
import BottomBar from "@//components/navigation/BottomBar.vue";

export default defineComponent({
  name: "SessionStatisticPage",
  components: {BottomBar, SideMenu, NavigationBar},
  props: {
    sessionId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const statsController = StatsController.getStatsController();
    const studentController = StudentController.getStudentConroller();
    const sessionController = SessionController.getSessionController();
    const session = sessionController.getSession(props.sessionId);

    let top5InteractionArray: never[] = [];
    let top5DisturberArray: never[] = [];

    let stats = statsController.getSessionStats(props.sessionId);

    let categoryMap = getMap();
    let keys = Array.from(categoryMap!.keys());
    let values = Array.from(categoryMap!.values());

    function getMap() {
      if (stats !== undefined) {
        top5InteractionArray = stats[0];
        top5DisturberArray = stats[4];
        return stats[5] as Map<string, number>;
      }
    }

    const sessionName = session?.name;
    const sessionDate = session?.date;
    const sessionCourse = session?.course.name;
    const sessionCourseSubject = session?.course.subject;

    const downloadElementCategoryChart = document.createElement("a");

    function saveStatisticClick() {
      downloadElementCategoryChart.click();
    }

    function showStatisticsClick(studentId: number) {
      router.push({
        name: "StudentStatisticPage",
        params: { studentId: studentId },
      });
    }

    onMounted(() => {
      if (document.getElementById("categoryChart") == null) {
        return;
      }

      const categoryChartId = document.getElementById(
        "categoryChart"
      ) as HTMLCanvasElement;

      if (stats == undefined) {
        return;
      }

      const categoryChartData = {
        labels:
          keys,
        datasets: [
          {
            label: "Anzahl",
            data:
              values,
          },
        ],
      };

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

      categoryChart.update();
    });
    return {
      stats,
      statsController,
      studentController,
      saveStatisticClick,
      top5InteractionArray,
      top5DisturberArray,
      sessionCourseSubject,
      sessionCourse,
      sessionDate,
      sessionName,
      keys,
      showStatisticsClick,
    };
  },
});
</script>

<style scoped></style>
