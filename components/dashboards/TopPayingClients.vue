<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Define the expected data structure
interface Educator {
  _id: string;
  name: string;
  email: string;
  position: string;
  earned: number;
}

// Explicitly type the `educators` array
const educators = ref<Educator[]>([]);
const loading = ref(true);
const errorMessage = ref('');

const fetchEducators = async () => {
  try {
    const response = await axios.get<Educator[]>('https://dark-caldron-448714-u5.uc.r.appspot.com/tutor/top');
    educators.value = response.data;
  } catch (error) {
    errorMessage.value = 'Failed to load educators. Please try again.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchEducators);
</script>

<template>
  <v-card elevation="10" class="pb-5">
    <v-card-item class="pa-6">
      <div class="d-flex align-center justify-space-between">
        <h5 class="text-h5 mt-1 mb-4 font-weight-semibold">Top Paying Educators</h5>
      </div>

      <div class="table-container">
        <v-table class="month-table">
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-bold">Name</th>
              <th class="text-subtitle-1 font-weight-bold">course</th>
              <th class="text-subtitle-1 font-weight-bold">Email</th>
              <th class="text-subtitle-1 font-weight-bold text-right">Earned</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center">Loading...</td>
            </tr>
            <tr v-if="errorMessage">
              <td colspan="4" class="text-center text-red">{{ errorMessage }}</td>
            </tr>
            <tr v-for="educator in educators" :key="educator._id">
              <td>{{ educator.name }}</td>
              <td>
                <h6 class="text-subtitle-1 font-weight-bold">{{ educator.position }}</h6>
              </td>
              <td>
                <h6 class="text-body-1 text-muted">{{ educator.email }}</h6>
              </td>
              <td class="text-right">
                <h6 class="text-h6">{{ educator.earned }}</h6>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.table-container {
  max-height: 300px; /* Adjust height as needed */
  overflow-y: auto;
}
</style>
