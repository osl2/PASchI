<template>
  <navigation-bar extended>
    <v-app-bar-title>
      Kursstatistiken des Kurses {{courseName + " (" + courseSubject + ")"}}
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
                  durchschnittliche Beteiligungsquote im Zeitverlauf
                  <v-spacer />
                </v-row>
              </v-card-title>
              <v-card-item>
                <canvas id = "involvementChart"/>
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
              <v-card-item>
                <canvas id = "categoryChart"/>
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
import { CourseController } from "@/controller/CourseController";


export default defineComponent({
  name: "CourseStatisticPage",
  components: {SideMenu, NavigationBar},
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

      const top5InteractionArray: never[] = [];
      const top5DisturberArray: never[] = [];

      const courseName = course?.name;
      const courseSubject = course?.subject;

      const downloadElementCategoryChart = document.createElement( 'a' );
      const downloadElementInvolvementChart = document.createElement( 'a' );

      function downloadClicked() {
        downloadElementInvolvementChart.click();
        downloadElementCategoryChart.click();

      }
      onMounted(() => {
          //const categoryChartId = document.getElementById('categoryChart') as HTMLCanvasElement;
          const involvementChartId = document.getElementById('involvementChart') as HTMLCanvasElement;
         // const top5InteractionChartId = document.getElementById('top5InteractionChart') as HTMLCanvasElement;
         // const top5DisturberChartId = document.getElementById('top5DisturberChart') as HTMLCanvasElement;

          const stats  = statsController.getCourseStats(props.courseId);

          if (stats == undefined) {
            console.log('stats could not be loaded');
            return;
          }


          //let keysInvolvementChart= stats[6].keys();
          //let valuesInvolvementChart = stats[6].values();

          //let keysCategoryChart = stats[5].keys();
          //let valuesCategoryChart = stats[5].values();

          //let top5InteractionArray = stats[0];
          //let top5DisturberArray = stats[4];

          const involvementChartData = {
            labels:
              ['5.12 dummy', '6.12 dummy', '9.12 dummy', '10.12 dummy', '11.12 dummy'],
            //keysInvolvementChart,
            datasets: [{
              label: 'Anzahl',
              data:
                [5,3,2,1,4],
              //valuesInvolvementChart,
            }]
          };

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

        const involvementChart = new Chart(involvementChartId, {
          type: 'line',
          data: involvementChartData,
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
              onComplete : buildInvolvementChart
            }
          }
        });

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
        function buildInvolvementChart(){
          downloadElementInvolvementChart.href = involvementChart.toBase64Image();
          downloadElementInvolvementChart.download = 'Beteiligungsverlauf.png';
        }

        categoryChart.update();
        involvementChart.update();

        }
      )
      return{
        statsController, studentController, courseName, courseSubject, downloadClicked, top5InteractionArray, top5DisturberArray
      }
    },
  }

)


</script>

<style scoped></style>
