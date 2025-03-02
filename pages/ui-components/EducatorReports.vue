<template>
    <v-container>
      <v-card class="pa-4 white-bg">
        <v-card-title class="text-h5">Educators Report</v-card-title>
  
        <!-- Search & Filter -->
        <v-row class="mt-3">
          <v-col cols="12" md="6">
            <v-text-field 
              v-model="searchQuery" 
              label="Search by name or subject" 
              clearable 
              prepend-inner-icon="mdi-magnify">
            </v-text-field>
          </v-col>
        </v-row>
  
        <!-- Overall Report Summary -->
        <v-card class="pa-4 mb-4 white-bg">
          <v-row>
            <v-col cols="12" sm="4">
              <v-card class="stat-card white-bg">
                <v-card-title class="text-h6">Total Educators</v-card-title>
                <v-card-subtitle class="stat-number">{{ totalEducators }}</v-card-subtitle>
              </v-card>
            </v-col>
  
            <v-col cols="12" sm="4">
              <v-card class="stat-card white-bg">
                <v-card-title class="text-h6">Average Student Pass Rate</v-card-title>
                <v-card-subtitle class="stat-number">{{ averagePassRate }}%</v-card-subtitle>
              </v-card>
            </v-col>
  
            <v-col cols="12" sm="4">
              <v-card class="stat-card white-bg">
                <v-card-title class="text-h6">Top Subject</v-card-title>
                <v-card-subtitle class="stat-number">{{ topSubject }}</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
  
        <!-- Charts Section -->
        <v-row class="chart-container">
          <!-- Bar Chart for Subject Distribution -->
          <v-col cols="12" md="6">
            <apexchart 
              type="bar" 
              height="400" 
              :options="barChartOptions" 
              :series="barChartSeries">
            </apexchart>
          </v-col>
  
          <!-- Pie Chart for Educators' Teaching Effectiveness -->
          <v-col cols="12" md="6">
            <apexchart 
              type="pie" 
              height="400" 
              :options="pieChartOptions" 
              :series="pieChartSeries">
            </apexchart>
          </v-col>
        </v-row>
  
        <!-- Scrollable Table -->
        <div class="table-container">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Profile</th>
                <th class="text-left">Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">Subject</th>
                <th class="text-left">Students Taught</th>
                <th class="text-left">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="educator in filteredEducators" :key="educator._id" @click="filterByEducator(educator)">
                <td>
                  <v-avatar size="40">
                    <img v-if="educator.profile_image" :src="educator.profile_image" alt="Profile Image">
                    <span v-else class="no-avatar">N/A</span>
                  </v-avatar>
                </td>
                <td>{{ educator.name }}</td>
                <td>{{ educator.email }}</td>
                <td>{{ educator.subject }}</td>
                <td>{{ educator.studentsTaught }}</td>
                <td :class="{'text-success': educator.passRate >= 50, 'text-error': educator.passRate < 50}">
                  {{ educator.passRate }}%
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
  
        <!-- Loading Indicator -->
        <div v-if="loading" class="text-center mt-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  
  const educators = ref([]);
  const searchQuery = ref('');
  const loading = ref(true);
  const selectedEducator = ref(null);
  
  // Fetch educators report from API
  const fetchEducatorsReport = async () => {
    try {
      const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/educators/report");
      educators.value = response.data.data;
    } catch (error) {
      console.error("Error fetching educator reports:", error);
    } finally {
      loading.value = false;
    }
  };
  
  // Computed properties for filtering and stats
  const filteredEducators = computed(() => {
    return educators.value.filter(educator =>
      educator.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      educator.subject.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  const totalEducators = computed(() => educators.value.length);
  const averagePassRate = computed(() => {
    if (!educators.value.length) return 0;
    const totalPassRate = educators.value.reduce((sum, educator) => sum + educator.passRate, 0);
    return (totalPassRate / educators.value.length).toFixed(2);
  });
  const topSubject = computed(() => {
    if (!educators.value.length) return "N/A";
    const subjects = educators.value.map(e => e.subject);
    return subjects.sort((a, b) =>
      subjects.filter(subj => subj === a).length - subjects.filter(subj => subj === b).length
    ).pop();
  });
  
  // ✅ Bar Chart Data (Subjects Distribution)
  const barChartSeries = computed(() => {
    const subjects = [...new Set(educators.value.map(e => e.subject))];
    const subjectCounts = subjects.map(subject => 
      educators.value.filter(e => e.subject === subject).length
    );
  
    return [{ name: "Educators", data: subjectCounts }];
  });
  
  const barChartOptions = computed(() => ({
    chart: {
      type: "bar",
      height: 400
    },
    xaxis: {
      categories: [...new Set(educators.value.map(e => e.subject))],
      title: { text: "Subjects" }
    },
    yaxis: {
      title: { text: "Number of Educators" }
    },
    colors: ["#3498db"],
    dataLabels: { enabled: true },
    legend: { position: "top" }
  }));
  
  // ✅ Pie Chart Data (Pass Rate Distribution)
  const pieChartSeries = computed(() => {
    const highPass = educators.value.filter(e => e.passRate >= 50).length;
    const lowPass = educators.value.filter(e => e.passRate < 50).length;
    return [highPass, lowPass];
  });
  
  const pieChartOptions = computed(() => ({
    labels: ["High Pass Rate", "Low Pass Rate"],
    chart: {
      type: "pie",
      height: 400
    },
    colors: ["#28a745", "#dc3545"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true }
  }));
  
  // ✅ Click to Filter by Educator
  const filterByEducator = (educator) => {
    searchQuery.value = educator.name;
  };
  
  onMounted(fetchEducatorsReport);
  </script>
  
  <style scoped>
  /* White Background, No Shadows */
  .white-bg {
    background: #ffffff !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  /* Center Chart */
  .chart-container {
    width: 100%;
  }
  
  /* Scrollable Table */
  .table-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
  }
  
  /* Avatar */
  .no-avatar {
    background: #ddd;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
  }
  </style>
  