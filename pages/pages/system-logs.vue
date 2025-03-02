<template>
    <v-container>
      <v-card class="pa-4 white-bg">
        <v-card-title class="text-h5">System Logs</v-card-title>
  
        <!-- Search & Filters -->
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-text-field 
              v-model="searchQuery" 
              label="Search Logs" 
              clearable 
              prepend-inner-icon="mdi-magnify">
            </v-text-field>
          </v-col>
        </v-row>
  
        <!-- Logs Table -->
        <div class="table-container">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Timestamp</th>
                <th class="text-left">Method</th>
                <th class="text-left">Endpoint</th>
                <th class="text-left">Status</th>
                <th class="text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in filteredLogs" :key="log._id">
                <td>{{ formatDate(log.timestamp) }}</td>
                <td class="font-weight-bold">{{ log.method }}</td>
                <td>{{ log.endpoint }}</td>
                <td :class="getStatusClass(log.status)">{{ log.status }}</td>
                <td>{{ log.message }}</td>
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
  
  const logs = ref([]);
  const searchQuery = ref('');
  const loading = ref(true);
  
  // Fetch System Logs from Backend
  const fetchLogs = async () => {
    try {
      const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/system-logs");
      logs.value = response.data.logs;
    } catch (error) {
      console.error("Error fetching system logs:", error);
    } finally {
      loading.value = false;
    }
  };
  
  // Computed property for filtering logs
  const filteredLogs = computed(() => {
    return logs.value.filter(log =>
      log.endpoint.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };
  
  // Get Status Color
  const getStatusClass = (status) => {
    if (status >= 200 && status < 300) return "text-success";  // Success (Green)
    if (status >= 400 && status < 500) return "text-warning";  // Client Error (Yellow)
    if (status >= 500) return "text-error";  // Server Error (Red)
    return "";
  };
  
  onMounted(fetchLogs);
  </script>
  
  <style scoped>
  /* White Background */
  .white-bg {
    background: #ffffff !important;
    border: none !important;
  }
  
  /* Scrollable Table */
  .table-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
  }
  
  /* Status Colors */
  .text-success {
    color: green;
    font-weight: bold;
  }
  .text-warning {
    color: orange;
    font-weight: bold;
  }
  .text-error {
    color: red;
    font-weight: bold;
  }
  </style>
  