<template>
  <navigation-bar />
  <v-main>
    <side-menu />
    <div>
      <canvas id="myChart" width="200" height="200"></canvas>
    </div>
  </v-main>
</template>

<script lang="ts">
import Chart from 'chart.js/auto';
import { CourseController } from "@/controller/CourseController";
import { defineComponent } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";


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
  },
  mounted() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    const data = {
      labels: [
        'Störung', 'gut', 'nur quatsch'
      ],
      datasets: [{
        label: 'katetgorien',
        data: [12, 19, 3],
      }]
    };

  const myChart = new Chart(ctx, {
    type: 'pie',
    data: data,
  });

  myChart;
}
})

</script>

<style scoped></style>
