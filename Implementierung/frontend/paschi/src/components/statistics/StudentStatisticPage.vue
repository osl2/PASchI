<template>
  <NavigationBar extended />
  <v-main>
    <SideMenu />
    <v-container fluid>
      <v-row justify="space-around" align-content="stretch">
        <v-col>
          <h3> Durchschnittliche Qualität </h3>
          {{statsController.getStudentStats(studentId)[1]}} / 5
        </v-col>
        <v-col>
          <canvas id = "categoryChart" width="100" />
        </v-col>
      </v-row>
    </v-container>

  </v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import Chart from 'chart.js/auto';
import {StatsController} from "@/controller/StatsController";




export default defineComponent({
  name: "StudentStatisticPage",
  components: {SideMenu, NavigationBar},

  props: {
    studentId: {
      type: String,
      required: true,
    },
  },

  setup(){
    const statsController = StatsController.getStatsController();

    return {
      statsController,
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
      //['test', 'test2', 'test3'],
        keys,
      datasets: [{
        label: 'Kategorien',
        data:
        //[1, 2, 3],
        values,
      }]
    };

    const categoryChart = new Chart(categoryChartId, {
      type: 'pie',
      data: data,

    });

    categoryChart;
  }
})

</script>

<style scoped></style>
