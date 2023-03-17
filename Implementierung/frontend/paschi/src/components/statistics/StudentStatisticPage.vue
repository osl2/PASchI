<template>
  <navigation-bar>
    <v-app-bar-title>
      Schülerstatistiken von {{ firstName + " " + lastName }}
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
    <BottomBar />
    <div id="content">
      <v-container fluid>
        <v-row justify="space-around" align-content="stretch">
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="text-wrap ma-2">
                  Durchschnittliche Qualität der Beiträge
                  <v-spacer />
                </v-row>
              </v-card-title>
              <v-card-item
                v-if="
                  statsController.getStudentStats(studentId) !== undefined &&
                  !isNaN(statsController.getStudentStats(studentId)[1])
                "
              >
                <v-rating
                  v-model="statsController.getStudentStats(studentId)[1]"
                  class="text-wrap ma-2"
                  readonly
                  hover
                  half-increments
                  item-label-position="top"
                ></v-rating>
              </v-card-item>
              <v-card-item v-else> Keine Daten verfügbar. </v-card-item>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="text-wrap ma-2">
                  Aufschlüsselung der Interaktionen nach Kategorien
                  <v-spacer />
                </v-row>
              </v-card-title>
              <v-card-item v-if="stats !== undefined && values.length !== 0">
                <canvas id="categoryChart" />
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
import BottomBar from "@/components/navigation/BottomBar.vue";

export default defineComponent({
  name: "StudentStatisticPage",
  components: {BottomBar, SideMenu, NavigationBar },

  props: {
    studentId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const statsController = StatsController.getStatsController();
    const studentController = StudentController.getStudentConroller();
    const firstName = studentController.getStudent(props.studentId)?.firstName;
    const lastName = studentController.getStudent(props.studentId)?.lastName;
    let stats = statsController.getStudentStats(props.studentId);

    const map = getMap();
    const keys = Array.from(map!.keys());
    const values = Array.from(map!.values());

    function getMap() {
      if (stats !== undefined) {
        return stats[0] as Map<string, number>;
      }
    }

    const downloadElement = document.createElement("a");

    function saveStatisticClick() {
      downloadElement.click();
    }

    onMounted(() => {
      if (document.getElementById("categoryChart") == null) {
        return;
      }
      const categoryChartId = document.getElementById(
        "categoryChart"
      ) as HTMLCanvasElement;
      stats = statsController.getStudentStats(props.studentId);

      if (stats == undefined) {
        console.log("stats could not be loaded");
        return;
      }

      const data = {
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
        data: data,
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
            onComplete: done,
          },
        },
      });



      function done() {
        downloadElement.href = categoryChart.toBase64Image();
        downloadElement.download = "Schülerstatistik.png";
      }

      categoryChart.update();
    });
    return {
      statsController,
      firstName,
      lastName,
      saveStatisticClick,
      stats,
      values,
      keys,
    };
  },
});
</script>

<style scoped></style>
