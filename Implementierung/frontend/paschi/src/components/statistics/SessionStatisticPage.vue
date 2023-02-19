<template>
  <navigation-bar extended>
    <v-app-bar-title>
      Sitzungsstatistiken der Sitzung am {{sessionDate}} des Kurses {{sessionCourse + " (" + sessionCourseSubject + ")"}}
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
                  Aufschlüsselung der Interaktionen nach Kategorien
                  <v-spacer />
                </v-row>
              </v-card-title>
              <v-card-item>
                <canvas id = "categoryChart"/>
              </v-card-item>
            </v-card>
          </v-col>
          <v-col>
            <v-card color="primary-lighten-1">
              <v-card-title>
                <v-row class="ma-2">
                  Durchschnittliche Beteiligungsqoute [%]
                  <v-spacer />
                </v-row>
              </v-card-title>
              <v-card-item>
                {{statsController.getSessionStats(sessionId)[6]}}
              </v-card-item>
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
              <v-card-item>
                <v-list>
                  <v-list-item v-for="studentId in top5InteractionArray">
                    <v-list-item-title>
                      {{studentController.getStudent(studentId).firstName + " " + studentController.getStudent(studentId).firstName}}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-item>
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
              <v-card-item>
                <v-list>
                  <v-list-item v-for="studentId in top5DisturberArray">
                    <v-list-item-title>
                      {{studentController.getStudent(studentId).firstName + " " + studentController.getStudent(studentId).firstName}}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
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
import { SessionController } from "@/controller/SessionController";


export default defineComponent({
    name: "SessionStatisticPage",
    components: {SideMenu, NavigationBar},
    props: {
      sessionId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const statsController = StatsController.getStatsController();
      const studentController = StudentController.getStudentConroller();
      const sessionController = SessionController.getSessionController()
      const session = sessionController.getSession(props.sessionId);

      const top5InteractionArray: never[] = [];
      const top5DisturberArray: never[] = [];

      const sessionName = session?.name;
      const sessionDate = session?.date;
      const sessionCourse = session?.course.name;
      const sessionCourseSubject = session?.course.subject;

      const downloadElementCategoryChart = document.createElement( 'a' );

      function downloadClicked() {
        downloadElementCategoryChart.click();

      }
      onMounted(() => {
          const categoryChartId = document.getElementById('categoryChart') as HTMLCanvasElement;
         // const top5InteractionChartId = document.getElementById('top5InteractionChart') as HTMLCanvasElement;
          //const top5DisturberChartId = document.getElementById('top5DisturberChart') as HTMLCanvasElement;

          const stats  = statsController.getSessionStats(props.sessionId);

          if (stats == undefined) {
            console.log('stats could not be loaded');
            return;
          }

          //let keysCategoryChart = stats[5].keys();
         // let valuesCategoryChart = stats[5].values();

          //let top5InteractionArray = stats[0];
          //let top5DisturberArray = stats[4];


          const categoryChartData = {
            labels:
              ['Störungsdummy', 'Antwortdummy', 'Fragendummy'],
            //keysCategoryChart,
            datasets: [{
              label: 'Anzahl',
              data:
                [5,3,2],
              //valuesCategoryChart,
            }]
          };

          const categoryChart = new Chart(categoryChartId, {
            type: 'pie',
            data: categoryChartData,
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
                onComplete: buildCategoryChart
              }
            }
          });


          function buildCategoryChart(){
            downloadElementCategoryChart.href = categoryChart.toBase64Image();
            downloadElementCategoryChart.download = 'Kategorienaufschlüsselung.png';
          }

          categoryChart.update();

        }
      )
      return{
        statsController, studentController, downloadClicked, top5InteractionArray, top5DisturberArray, sessionCourseSubject, sessionCourse, sessionDate, sessionName
      }
    },
  }

)


</script>

<style scoped></style>
