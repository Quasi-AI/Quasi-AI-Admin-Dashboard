<template>
    <v-card class="white-card">
        <v-card-item class="pa-6">
            <div class="d-flex align-center justify-space-between pt-sm-2">
                <v-card-title class="text-h5">Revenue Growth</v-card-title>
            </div>
            <v-row>
                <v-col cols="12">
                    <div class="mt-2">
                        <h3 class="text-h4">
                            {{ isLoading ? 'Loading...' : `$${formatNumber(totalRevenue)}` }}
                        </h3>
                        <div class="mt-2">
                            <v-avatar class="bg-lighterror text-accent" size="20">
                                <ArrowDownRightIcon class="text-error" size="15" />
                            </v-avatar>
                            <span class="text-subtitle-1 ml-2 font-weight-bold">{{ revenueGrowth }}%</span>
                            <span class="text-subtitle-1 text-muted ml-2">compared to last year</span>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
        
        <div class="mt-3">
            <apexchart 
                type="area" 
                height="60" 
                :options="areachartOptions" 
                :series="chartData">
            </apexchart>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const isLoading = ref(true);
const paymentData = ref<number[]>([]);
const totalRevenue = ref(0);
const lastYearRevenue = ref(1); // Avoid division by zero

// Fetch Payment Data
const fetchPayments = async () => {
  try {
    const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/getAllPaymentHistoryOrder");
    
    // Extract amountPaid values
    paymentData.value = response.data.map((item: any) => item.amountPaid);
    
    // Calculate total revenue
    totalRevenue.value = paymentData.value.reduce((sum, amount) => sum + amount, 0);
    
    // Mock last year's revenue for growth calculation (Replace with real API data if available)
    lastYearRevenue.value = totalRevenue.value - Math.floor(Math.random() * 2000);
    
  } catch (error) {
    console.error("Error fetching payment data:", error);
  } finally {
    isLoading.value = false;
  }
};

// Compute revenue growth percentage
const revenueGrowth = computed(() => {
  if (lastYearRevenue.value === 0) return "0%";
  return (((totalRevenue.value - lastYearRevenue.value) / lastYearRevenue.value) * 100).toFixed(1);
});

// Format numbers (e.g., 1K+, 1M+)
const formatNumber = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M+`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K+`;
  return `${num}`;
};

// Chart Options
const areachartOptions = computed(() => ({
    chart: {
        id: "sparkline3",
        type: "area",
        height: 60,
        sparkline: { enabled: true },
        group: "sparklines",
        fontFamily: 'inherit',
        foreColor: "#adb0bb",
    },
    stroke: { curve: "smooth", width: 2 },
    fill: { colors: ["#f3feff"], type: "solid", opacity: 0.05 },
    markers: { size: 0 },
    tooltip: { theme: "dark", fixed: { enabled: true, position: "right" }, x: { show: false } },
}));

// Update chart data dynamically
const chartData = computed(() => [{ name: "Earnings", data: paymentData.value }]);

onMounted(fetchPayments);
</script>

<style scoped>
/* Clean white background, no shadow */
.white-card {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    padding: 20px;
}

/* Typography */
.textPrimary {
    color: var(--v-primary-base) !important;
}
</style>
