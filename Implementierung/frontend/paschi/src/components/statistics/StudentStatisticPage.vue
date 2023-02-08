<template>
  <NavigationBar extended>
    <template v-slot:extension>
      <v-btn @click="saveStatisticsClick">Statistik herunterladen</v-btn>
    </template>
  </NavigationBar>

  <v-main>
    <SideMenu />
    <v-container>
      <BarChart :chartData="chartData" :chartOptions="chartOptions"/>
    </v-container>

  </v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import BarChart from "@/components/statistics/BarChart.vue";
import { Bar } from "vue-chartjs";


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: "StudentStatisticPage",
  components: {BarChart, Bar, SideMenu, NavigationBar},



  setup(){
    /*const saveStatisticsffClick {


    }
    return {
      saveStatisticsClick,
    }*/
  },

  data() {
    return {
      chartData: {
        labels: [ '1.10', '5.10', '6.10', '7.10' ],
        datasets: [ {
          data: [40, 20, 12, 38],
          label: 'Beteiligungsquote',

        } ]
      },
      chartOptions: {
        responsive: true
      }
    }
  },

  props: {
    studentId: {
      type: String,
      required: true,
    },

  },
})




</script>

<style scoped></style>
