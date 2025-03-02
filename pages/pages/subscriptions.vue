<template>
    <v-container>
      <v-card class="pa-4 white-bg">
        <v-card-title class="text-h5">Subscription Plans</v-card-title>
  
        <!-- Search & Filters -->
        <v-row class="mt-4">
          <v-col cols="12" md="4">
            <v-text-field 
              v-model="searchQuery" 
              label="Search by name or email" 
              clearable 
              prepend-inner-icon="mdi-magnify">
            </v-text-field>
          </v-col>
  
          <v-col cols="6" md="4">
            <v-select 
              v-model="selectedPlan" 
              :items="['All', 'Premium', 'Free']" 
              label="Filter by Plan" 
              dense clearable>
            </v-select>
          </v-col>
  
          <v-col cols="6" md="4">
            <v-select 
              v-model="selectedStatus" 
              :items="['All', 'Active', 'Expired']" 
              label="Filter by Status" 
              dense clearable>
            </v-select>
          </v-col>
        </v-row>
  
        <!-- Subscribed Users Table -->
        <div class="table-container">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Profile</th>
                <th class="text-left">Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">Plan</th>
                <th class="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user._id">
                <td>
                  <v-avatar size="40">
                    <img v-if="user.profileImage" :src="user.profileImage" alt="Profile Image">
                    <span v-else class="no-avatar">N/A</span>
                  </v-avatar>
                </td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td :class="{
                    'text-premium': user.plan === 'Premium', 
                    'text-free': user.plan === 'Free'
                    }">
                {{ user.plan }}
                </td>
  
                <td :class="{
                    'text-success': user.status === 'Active', 
                    'text-error': user.status === 'Expired',
                    'text-neutral': user.status === '--'
                    }">
                {{ user.status }}
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
  
  const users = ref([]);
  const searchQuery = ref('');
  const selectedPlan = ref('All');
  const selectedStatus = ref('All');
  const loading = ref(true);
  
  // Fetch subscribed users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/getAllSubscriptionHistory");
      users.value = response.data.data;
    } catch (error) {
      console.error("Error fetching subscription users:", error);
    } finally {
      loading.value = false;
    }
  };
  
  // Computed properties for filtering users
  const filteredUsers = computed(() => {
    return users.value.filter(user =>
      (user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
       user.email.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      (selectedPlan.value === 'All' || user.plan === selectedPlan.value) &&
      (selectedStatus.value === 'All' || user.status === selectedStatus.value)
    );
  });
  
  onMounted(fetchUsers);
  </script>
  
  <style scoped>
  /* White Background, No Shadows */
  .white-bg {
    background: #ffffff !important;
    border: none !important;
    box-shadow: none !important;
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
  
  /* Plan Colors */
  .text-premium {
    color: #8C71FF;
    font-weight: bold;
  }
  .text-free {
    color: #6c757d;
    font-weight: bold;
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
  .text-neutral {
    color: gray;
    font-weight: bold;
  }
  </style>
  