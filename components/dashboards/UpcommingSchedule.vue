<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { CircleIcon } from 'vue-tabler-icons';

// Define Transaction Interface
interface Transaction {
  title: string;
  subtitle: string;
  textcolor: string;
  boldtext: boolean;
  line: boolean;
  link?: string;
  url?: string;
}

// Reactive state
const recentTransaction = ref<Transaction[]>([]);

// Fetch Payment History from API
const fetchPaymentHistory = async () => {
  try {
    const response = await axios.get<{ data: { createdAt: string; amountPaid: number; payerName: string; status: string }[] }>(
      "https://dark-caldron-448714-u5.uc.r.appspot.com/getAllPaymentHistory"
    );

    // Transform API response to match expected format
    recentTransaction.value = response.data.data.map((item) => ({
      title: new Date(item.createdAt).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      subtitle: `Payment of $${item.amountPaid} by ${item.payerName}`,
      textcolor: item.status === 'Paid' ? 'success' : 'error',
      boldtext: true,
      line: true,
      link: '',
      url: ''
    }));

  } catch (error) {
    console.error("Error fetching payment history:", error);
  }
};

// Fetch data on component mount
onMounted(fetchPaymentHistory);
</script>

<template>
  <v-card elevation="10" class="withbg pa-3">
    <v-card-item class="pb-0">
      <v-card-title class="text-h5 pt-sm-2">Subscription Plan History</v-card-title>
      
      <div class="transaction-container mt-10 px-3">
        <div v-for="(list, index) in recentTransaction" :key="index">
          
          <v-row class="d-flex mb-4">
            <v-col cols="4" lg="3" md="auto" sm="auto" class="px-0 pt-0 pb-1 d-flex align-start">
              <h6 class="text-body-1 textSecondary text-no-wrap">{{ list.title }}</h6>
            </v-col>
            <v-col cols="1" sm="1" class="px-0 text-center pt-0 pb-1">
              <CircleIcon size="13" :class="'text-' + list.textcolor" />
              <div v-if="list.line" class="line mx-auto bg-borderColor"></div>
            </v-col>
            <v-col cols="7" sm="8" class="pt-0">
              <h6 v-if="list.boldtext" class="text-body-1 font-weight-bold">{{ list.subtitle }}</h6>
              <h6 v-else class="text-body-1 textSecondary">{{ list.subtitle }}</h6>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>


<style scoped>
/* Scrollable transaction list */
.transaction-container {
  max-height: 300px;
  overflow-y: auto;
  padding-top: 5px; /* Ensure first item is not clipped */
}


.recent-transaction .line {
  width: 2px;
  height: 35px;
}
</style>
