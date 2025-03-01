<template>
  <v-card class="pa-3" elevation="10">
    <v-card-item>
      <div class="d-flex align-center justify-space-between">
        <h5 class="text-h5 mb-1 font-weight-semibold">Students and Educators</h5>
      </div>

      <v-row>
        <v-col cols="12" class="pt-7">
          <!-- Scrollable Container -->
          <div class="chart-scroll-container">
            <apexchart
              type="bar"
              height="370px"
              :options="chartOptions"
              :series="series"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<style scoped>
/* Scrollable chart container */
.chart-scroll-container {
  overflow-x: auto; /* Enable horizontal scrolling */
  white-space: nowrap; /* Prevents wrapping */
  width: 100%; /* Ensures it takes full width */
  max-width: 100vw; /* Avoids overflow issues */
  padding-bottom: 10px; /* Space for scrollbar */
}
</style>


<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useTheme } from 'vuetify';

const theme = useTheme();
const primary = theme.current.value.colors.primary;
const error = theme.current.value.colors.error;

// Reactive data for chart
const dates = ref<string[]>([]);
const studentData = ref<number[]>([]);
const educatorData = ref<number[]>([]);
const series = ref([]);

// Default chart options
const chartOptions = ref({
  chart: { type: "bar", height: 370 },
  xaxis: { categories: [] },  // Initially empty
  colors: [primary, error],
  stroke: { show: true, width: 2, colors: ["transparent"] },
  fill: { opacity: 1 },
});

// Fetch data from API
const fetchSignups = async () => {
  try {
    const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/analytics");
    dates.value = response.data.dates;
    studentData.value = response.data.studentData;
    educatorData.value = response.data.educatorData;
  } catch (error) {
    console.error("Error fetching sign-up data:", error);
  }
};

// Watch for changes in data and update chart
watch([dates, studentData, educatorData], () => {
  series.value = [
    { name: "Student", data: studentData.value },
    { name: "Educator", data: educatorData.value },
  ];

  chartOptions.value = {
    chart: { type: "bar", height: 370 },
    xaxis: { categories: dates.value },
    colors: [primary, error],
    stroke: { show: true, width: 2, colors: ["transparent"] },
    fill: { opacity: 1 },
  };
});

// Fetch data when component is mounted
onMounted(fetchSignups);
</script>
