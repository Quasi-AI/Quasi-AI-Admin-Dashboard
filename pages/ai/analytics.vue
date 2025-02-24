<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import { Chart, registerables } from "chart.js";
  
  Chart.register(...registerables);
  
  const chartCanvas = ref(null);
  
  const generateWaveGrowthData = () => {
    const years = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];
    const growthData = years.map((year, index) => ({
      year,
      value: Math.round(50 + 30 * Math.sin(index * 1.2)) // Sine wave growth simulation
    }));
  
    return {
      labels: growthData.map((d) => d.year),
      datasets: [
        {
          label: "ChatGPT Growth",
          data: growthData.map((d) => d.value),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.5)",
          fill: true,
          tension: 0.4, // Smooth wave curve
        },
      ],
    };
  };
  
  onMounted(() => {
    new Chart(chartCanvas.value, {
      type: "line",
      data: generateWaveGrowthData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  });
  </script>
  
  <style scoped>
  div {
    width: 100%;
    height: 300px;
  }
  </style>
  