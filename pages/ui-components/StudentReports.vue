<template>
    <v-container>
      <v-card class="pa-4 white-bg">
        <v-card-title class="text-h5">Students Report</v-card-title>
  
        <!-- Search & Filter -->
        <v-row class="mt-3">
          <v-col cols="12" md="6">
            <v-text-field 
              v-model="searchQuery" 
              label="Search by name or email" 
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
                <v-card-title class="text-h6">Total Students</v-card-title>
                <v-card-subtitle class="stat-number">{{ totalStudents }}</v-card-subtitle>
              </v-card>
            </v-col>
  
            <v-col cols="12" sm="4">
              <v-card class="stat-card white-bg">
                <v-card-title class="text-h6">Average Score</v-card-title>
                <v-card-subtitle class="stat-number">{{ averageScore }}</v-card-subtitle>
              </v-card>
            </v-col>
  
            <v-col cols="12" sm="4">
              <v-card class="stat-card white-bg">
                <v-card-title class="text-h6">Pass Rate</v-card-title>
                <v-card-subtitle class="stat-number">{{ passRate }}%</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
  
        <!-- Charts Section -->
        <v-row class="chart-container">
          <!-- Stacked Bar Chart for Practice Type -->
          <v-col cols="12" md="6">
            <apexchart 
              type="bar" 
              height="400" 
              :options="barChartOptions" 
              :series="barChartSeries">
            </apexchart>
          </v-col>
  
          <!-- Pie Chart for Overall Pass/Fail -->
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
                <th class="text-left">Score</th>
                <th class="text-left">Practice Type</th>
                <th class="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student._id" @click="filterByStudent(student)">
                <td>
                  <v-avatar size="40">
                    <img v-if="student.profile_image" :src="student.profile_image" alt="Profile Image">
                    <span v-else class="no-avatar">N/A</span>
                  </v-avatar>
                </td>
                <td>{{ student.name }}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.score }}</td>
                <td>{{ student.practice_type }}</td>
                <td :class="{'text-success': student.status === 'Pass', 'text-error': student.status === 'Fail'}">
                  {{ student.status }}
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
  
  const students = ref([]);
  const searchQuery = ref('');
  const loading = ref(true);
  const selectedStudent = ref(null);
  
  // Fetch students report from API
  const fetchStudentsReport = async () => {
    try {
      const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/students/report");
      students.value = response.data.data;
    } catch (error) {
      console.error("Error fetching student reports:", error);
    } finally {
      loading.value = false;
    }
  };
  
  // Computed properties for filtering and stats
  const filteredStudents = computed(() => {
    return students.value.filter(student =>
      student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  const totalStudents = computed(() => students.value.length);
  const averageScore = computed(() => {
    if (!students.value.length) return 0;
    const totalScore = students.value.reduce((sum, student) => sum + student.score, 0);
    return (totalScore / students.value.length).toFixed(2);
  });
  const passRate = computed(() => {
    if (!students.value.length) return 0;
    const passedStudents = students.value.filter(student => student.status === 'Pass').length;
    return ((passedStudents / students.value.length) * 100).toFixed(1);
  });
  
  // ✅ Stacked Bar Chart Data (Pass/Fail Count by Practice Type)
  const barChartSeries = computed(() => {
    const practiceTypes = [...new Set(students.value.map(s => s.practice_type))];
  
    const passCounts = practiceTypes.map(type => 
      students.value.filter(s => s.practice_type === type && s.status === 'Pass').length
    );
  
    const failCounts = practiceTypes.map(type => 
      students.value.filter(s => s.practice_type === type && s.status === 'Fail').length
    );
  
    return [
      { name: "Passed", data: passCounts },
      { name: "Failed", data: failCounts }
    ];
  });
  
  const barChartOptions = computed(() => ({
    chart: {
      type: "bar",
      height: 400,
      stacked: true
    },
    xaxis: {
      categories: [...new Set(students.value.map(s => s.practice_type))],
      title: { text: "Practice Type" }
    },
    yaxis: {
      title: { text: "Number of Students" }
    },
    colors: ["#28a745", "#dc3545"], // Green = Pass, Red = Fail
    dataLabels: { enabled: true },
    legend: { position: "top" }
  }));
  
  // ✅ Pie Chart Data (Total Pass/Fail)
  const pieChartSeries = computed(() => {
    const passCount = students.value.filter(s => s.status === 'Pass').length;
    const failCount = students.value.filter(s => s.status === 'Fail').length;
    return [passCount, failCount];
  });
  
  const pieChartOptions = computed(() => ({
    labels: ["Passed", "Failed"],
    chart: {
      type: "pie",
      height: 400
    },
    colors: ["#28a745", "#dc3545"], // Green = Pass, Red = Fail
    legend: { position: "bottom" },
    dataLabels: { enabled: true }
  }));
  
  // ✅ Click to Filter by Student
  const filterByStudent = (student) => {
    searchQuery.value = student.name;
  };
  
  onMounted(fetchStudentsReport);
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
  