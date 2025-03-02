<template>
    <v-container>
      <v-card class="pa-4 white-bg">
        <v-card-title class="text-h5">Financial Overview</v-card-title>
  
        <!-- Summary Cards -->
        <v-row class="mt-4">
          <v-col cols="12" md="4">
            <v-card class="summary-card">
              <v-card-title class="text-h6">Total Revenue</v-card-title>
              <v-card-subtitle class="summary-value">${{ formatNumber(totalRevenue) }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="summary-card">
              <v-card-title class="text-h6">Total Expenses</v-card-title>
              <v-card-subtitle class="summary-value text-error">-${{ formatNumber(totalExpenses) }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="summary-card">
              <v-card-title class="text-h6">Net Profit</v-card-title>
              <v-card-subtitle class="summary-value" :class="profitClass">
                ${{ formatNumber(netProfit) }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Revenue Growth & Subscription Chart -->
        <v-row class="mt-4 chart-container">
          <v-col cols="12" md="6">
            <canvas id="revenueChart" class="chart"></canvas>
          </v-col>
          <v-col cols="12" md="6">
            <canvas id="subscriptionChart" class="chart"></canvas>
          </v-col>
        </v-row>
  
        <!-- Transactions Table -->
        <div class="table-container">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Date</th>
                <th class="text-left">Description</th>
                <th class="text-left">Amount</th>
                <th class="text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td>{{ formatDate(transaction.date) }}</td>
                <td>{{ transaction.description }}</td>
                <td :class="{'text-success': transaction.type === 'Revenue', 'text-error': transaction.type === 'Expense'}">
                  {{ transaction.type === 'Revenue' ? '+' : '-' }}${{ transaction.amount }}
                </td>
                <td>{{ transaction.type }}</td>
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
  import Chart from 'chart.js/auto';
  
  const totalRevenue = ref(0);
  const totalExpenses = ref(0);
  const transactions = ref([]);
  const revenueGrowth = ref([]);
  const freeUsers = ref(0);
  const premiumUsers = ref(0);
  const loading = ref(true);
  
  const fetchFinancialData = async () => {
    try {
      const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/financial-overview");
  
      totalRevenue.value = response.data.totalRevenue;
      totalExpenses.value = response.data.totalExpenses;
      transactions.value = response.data.transactions;
      revenueGrowth.value = response.data.revenueGrowth;
      freeUsers.value = response.data.freeUsers;
      premiumUsers.value = response.data.premiumUsers;
  
      renderCharts();
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      loading.value = false;
    }
  };
  
  // Format Numbers (K+, M+)
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M+`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K+`;
    return `${num}`;
  };
  
  // Format Date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };
  
  // Compute Net Profit
  const netProfit = computed(() => totalRevenue.value - totalExpenses.value);
  
  // Profit Class (Green for positive, Red for negative)
  const profitClass = computed(() => ({
    "text-success": netProfit.value >= 0,
    "text-error": netProfit.value < 0
  }));
  
  // Render Charts
  const renderCharts = () => {
    const revenueCtx = document.getElementById("revenueChart") as HTMLCanvasElement;
    new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [{
          label: "Revenue Growth",
          data: revenueGrowth.value,
          borderColor: "#8C71FF",
          backgroundColor: "rgba(140, 113, 255, 0.2)",
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  
    const subscriptionCtx = document.getElementById("subscriptionChart") as HTMLCanvasElement;
    new Chart(subscriptionCtx, {
      type: "pie",
      data: {
        labels: ["Free Users", "Premium Users"],
        datasets: [{
          data: [freeUsers.value, premiumUsers.value],
          backgroundColor: ["#8C71FF", "#FF6B6B"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  };
  
  onMounted(fetchFinancialData);
  </script>
  
  <style scoped>
  /* White Background */
  .white-bg {
    background: #ffffff !important;
    border: none !important;
  }
  
  /* Summary Cards */
  .summary-card {
    text-align: center;
    padding: 20px;
    border-radius: 8px;
    background: #f8f9fa;
  }
  
  /* Summary Values */
  .summary-value {
    font-size: 24px;
    font-weight: bold;
    color: #8C71FF;
  }
  
  /* Scrollable Table */
  .table-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
  }
  
  /* Revenue/Expense Colors */
  .text-success {
    color: green;
    font-weight: bold;
  }
  .text-error {
    color: red;
    font-weight: bold;
  }
  
  /* Centered Charts with Fixed Height */
  .chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .chart {
    width: 100% !important;
    max-height: 300px !important; /* ✅ Ensures Pie & Line charts are same height */
  }
  </style>
  