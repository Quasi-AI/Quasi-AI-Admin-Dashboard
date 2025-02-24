<template>
    <v-container>
      <UiParentCard title="Database Management">
        <v-card class="p-4 shadow-md rounded-lg border border-gray-300" rounded="0">
          <v-divider class="mb-4"></v-divider>
  
          <!-- Table List -->
          <v-card-text>
            <v-select v-model="selectedTable" :items="tables" label="Select Table" outlined></v-select>
          </v-card-text>
  
          <!-- Perform Data Analysis -->
          <v-card-text>
            <v-btn color="primary" @click="fetchTableData">Analyze Table</v-btn>
          </v-card-text>
  
          <!-- Data Insights -->
          <v-card v-if="tableData.length" class="mt-4 p-4" rounded="0">
            <h3 class="text-lg font-semibold mb-2">Data Insights</h3>
            <v-divider class="mb-2"></v-divider>
            <p>Total Records: {{ tableData.length }}</p>
            <p>Unique Fields: {{ uniqueFields.join(", ") }}</p>
          </v-card>
  
          <!-- Download Reports -->
          <v-card-actions>
            <v-btn color="success" @click="downloadCSV">Download CSV</v-btn>
            <v-btn color="info" @click="downloadJSON">Download JSON</v-btn>
          </v-card-actions>
        </v-card>
      </UiParentCard>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  const tables = ref([]);
  const selectedTable = ref(null);
  const tableData = ref([]);
  const uniqueFields = ref([]);
  
  // Fetch all collections (tables)
  const fetchTables = async () => {
    try {
      const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/tables"); // Backend endpoint
      tables.value = response.data;
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };
  
  // Fetch data for selected table
  const fetchTableData = async () => {
    if (!selectedTable.value) return;
    try {
      const response = await axios.get(`https://dark-caldron-448714-u5.uc.r.appspot.com/tables/${selectedTable.value}`);
      tableData.value = response.data;
      uniqueFields.value = [...new Set(response.data.flatMap(Object.keys))]; // Extract unique fields
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };
  
  // Download as CSV
  const downloadCSV = () => {
    if (!tableData.value.length) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [uniqueFields.value.join(","), ...tableData.value.map((row) => uniqueFields.value.map((f) => row[f] || "").join(","))].join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedTable.value}.csv`);
    document.body.appendChild(link);
    link.click();
  };
  
  // Download as JSON
  const downloadJSON = () => {
    if (!tableData.value.length) return;
    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tableData.value, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", `${selectedTable.value}.json`);
    document.body.appendChild(link);
    link.click();
  };
  
  onMounted(fetchTables);
  </script>
  
  <style scoped>
  /* Custom styles */
  </style>
  