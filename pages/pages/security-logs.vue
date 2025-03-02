<template>
    <v-container>
      <v-card class="pa-4 white-bg">
        <v-card-title class="text-h5">Security Logs</v-card-title>
  
        <!-- Search & Filter -->
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-text-field 
              v-model="searchQuery" 
              label="Search by User or Action" 
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
                <th class="text-left">User</th>
                <th class="text-left">Action</th>
                <th class="text-left">Status</th>
                <th class="text-left">IP Address</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in filteredLogs" :key="log._id">
                <td>{{ formatDateTime(log.timestamp) }}</td>
                <td>{{ log.user }}</td>
                <td>{{ log.action }}</td>
                <td :class="{
                    'text-success': log.status === 'Success',
                    'text-error': log.status === 'Failed'
                  }">
                  {{ log.status }}
                </td>
                <td>{{ log.ipAddress }}</td>
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
  import { ref, computed, onMounted } from "vue";
  import axios from "axios";
  
  const logs = ref([]);
  const searchQuery = ref("");
  const loading = ref(true);
  
  // ✅ Fetch security logs from API
  const fetchLogs = async () => {
    try {
      const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/security-logs");
      logs.value = response.data.logs;
    } catch (error) {
      console.error("Error fetching security logs:", error);
    } finally {
      loading.value = false;
    }
  };
  
  // ✅ Auto-refresh logs every 30 seconds
  setInterval(fetchLogs, 30000);
  
  // ✅ Computed: Filter logs based on search
  const filteredLogs = computed(() => {
    return logs.value.filter(log =>
      log.user.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  // ✅ Format date & time
  const formatDateTime = (timestamp: string) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };
  
  // ✅ Fetch logs on component mount
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
  .text-error {
    color: red;
    font-weight: bold;
  }
  </style>
  