<template>
  <NavigationBar>
    <template #default>
      <v-app-bar-title>
        Schülerstatistiken von {{firstName + " " + lastName}}
      </v-app-bar-title>
    </template>
  </NavigationBar>
  <v-main>
    <SideMenu />
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
            <v-card-item>
              {{statsController.getStudentStats(studentId)[1]}} / 5
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
    </v-container>

  </v-main>
</template>

<script lang="ts">
import {defineComponent, ref, Ref} from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import Chart from 'chart.js/auto';
import {StatsController} from "@/controller/StatsController";
import {StudentController} from "@/controller/StudentController";
import {Student} from "@/model/userdata/interactions/Student";




export default defineComponent({
  name: "StudentStatisticPage",
  components: {SideMenu, NavigationBar},

  props: {
    studentId: {
      type: String,
      required: true,
    },
  },

  setup(props){
    const statsController = StatsController.getStatsController();
    const studentController = StudentController.getStudentConroller();
    const firstName = studentController.getStudent(props.studentId)?.firstName;
    const lastName = studentController.getStudent(props.studentId)?.lastName;



    return {
      statsController, firstName, lastName
    };
    /*const saveStatisticsClick {


    }
    return {
      saveStatisticsClick,
    }*/
  },


  mounted() {
    const categoryChartId = document.getElementById('categoryChart') as HTMLCanvasElement;
    const stats  = this.statsController.getStudentStats(this.studentId);

    if (stats == undefined) {
      console.log('stats controller konnte nicht erreicht werden');
      return;
    }

    let keys = stats[0].keys();
    let values = stats[0].values();
    console.log(keys  + 'das waren die keys');
    console.log(values);

    const data = {
      labels:
      ['Störungsdummy', 'Antwortdummy', 'Fragendummy'],
        //keys,
      datasets: [{
        label: 'Kategorien',
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
              color: 'rgb(255, 255, 255)'
            }
          }
        }
      }

    });

    categoryChart;
  }
})

</script>

<style scoped></style>
