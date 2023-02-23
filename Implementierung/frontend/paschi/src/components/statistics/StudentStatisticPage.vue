<template>
  <navigation-bar extended>
    <v-app-bar-title>
      Schülerstatistiken von {{firstName + " " + lastName}}
    </v-app-bar-title>
    <template v-slot:extension>
      <v-btn
        variant="flat"
        color="green"
        rounded
        prepend-icon="mdi mdi-download"
        @click="downloadClicked"
      > Statistiken herunterladen</v-btn>
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
                Durchschnittliche Qualität der Beiträge
                <v-spacer />
              </v-row>
            </v-card-title>
            <v-card-item v-if="statsController.getStudentStats(studentId) !== undefined && statsController.getStudentStats(studentId)[1]!== 0">
              {{statsController.getStudentStats(studentId)[1]}} / 5
            </v-card-item>
            <v-card-item v-else>
              Keine Daten verfügbar.
            </v-card-item>
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
            <v-card-item v-if="stats !== undefined && stats[0].values().length() != 0">
              <canvas id = "categoryChart"/>
            </v-card-item>
            <v-card-item v-else>
              Keine Daten verfügbar.
            </v-card-item>
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
import Chart from 'chart.js/auto';
import {StatsController} from "@/controller/StatsController";
import {StudentController} from "@/controller/StudentController";


export default defineComponent({
  name: "StudentStatisticPage",
  components: {SideMenu, NavigationBar},

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
    let stats;

    const downloadElement = document.createElement('a');

    function downloadClicked() {
      downloadElement.click();
    }

    onMounted(() => {
        if (document.getElementById('categoryChart') == null) {
          return;
        }
        const categoryChartId = document.getElementById('categoryChart') as HTMLCanvasElement;
        stats  = statsController.getStudentStats(props.studentId);

        if (stats == undefined) {
          console.log('stats could not be loaded');
          return;
        }

        //let keys = stats[0].keys();
        //let values = stats[0].values();


        const data = {
          labels:
            ['Störungsdummy', 'Antwortdummy', 'Fragendummy'],
          //keys,
          datasets: [{
            label: 'Anzahl',
            data:
              [5,47,19],
            //values,
          }]
        };


        const categoryChart = new Chart(categoryChartId, {
          type: 'pie',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: 'rgb(0,0,0)'
                }
              }
            },
            animation : {
              onComplete : done
            }
          }
        });


        function done(){
          downloadElement.href = categoryChart.toBase64Image();
            downloadElement.download = 'Schülerstatistik.png';
          }

          categoryChart.update();

        }
      )
      return{
        statsController, firstName, lastName, downloadClicked, stats,
      }
    },

  }

)



</script>

<style scoped></style>
