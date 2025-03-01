<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const studentCount = ref(0);
const educatorCount = ref(0);
const isLoading = ref(true);

// Fetch data from API and count items in the response
const fetchData = async () => {
  try {
    const studentResponse = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/students/");
    const educatorResponse = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/educators/");

    // Count the number of students and educators from the response array
    studentCount.value = studentResponse.data.totalStudents;
    educatorCount.value = educatorResponse.data.totalEducators;

  } catch (error) {
    console.error("Error fetching traffic data:", error);
  } finally {
    isLoading.value = false;
  }
};

const totalUsers = computed(() => studentCount.value + educatorCount.value);


const formatNumber = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M+`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K+`;
  return `${num}+`;
};

onMounted(fetchData);
</script>

<template>
    <v-card class="white-card pa-4">
        <v-card-item>
            <div class="d-flex align-center justify-space-between">
                <v-card-title class="text-h5 font-weight-medium">Total Users</v-card-title>
            </div>
            
            <v-row class="mt-3">
                <v-col cols="12">
                    <div class="pa-4 text-center total-card">
                        <h4 class="text-h6 textPrimary">Total Students + Educators</h4>
                        <h2 class="text-h3 font-weight-bold">
                          {{ isLoading ? 'Loading...' : formatNumber(totalUsers) }}
                        </h2>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>

<style scoped>
/* Clean, white background with no shadow */
.white-card {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
}

/* Centered, bold total users section */
.total-card {
    background: transparent;
    border-radius: 10px;
    padding: 20px;
}

/* Text color */
.textPrimary {
    color: var(--v-primary-base) !important;
}

/* Subtle hover effect */
.total-card:hover {
    transform: scale(1.03);
    transition: transform 0.2s ease-in-out;
}
</style>
