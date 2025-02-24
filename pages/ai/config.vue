<template>
    <v-container>
      <v-btn color="primary" @click="openModal">+ Add AI Configuration</v-btn>
  
      <!-- Success/Error Alert -->
      <v-alert v-if="message" :type="messageType" class="mt-3" dismissible>
        {{ message }}
      </v-alert>
  
      <!-- AI Configurations Table -->
      <v-card class="mt-4">
        <v-card-title>AI Configurations</v-card-title>
        <v-table>
            <thead>
            <tr>
                <th>API Key</th>
                <th>Model</th>
                <th>Temperature</th>
                <th>Max Tokens</th>
                <th>Streaming</th>
                <th>Created At</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in configList" :key="index">
                <td>{{ item.apiKey }}</td>
                <td>{{ item.model ?? 'N/A' }}</td>
                <td>{{ item.temperature ?? 'N/A' }}</td>
                <td>{{ item.maxTokens ?? 'N/A' }}</td>
                <td>
                <v-icon v-if="item.streaming" color="green">mdi-check</v-icon>
                <v-icon v-else color="red">mdi-close</v-icon>
                </td>
                <td>{{ item.createdAt }}</td>
            </tr>
            </tbody>
        </v-table>
        </v-card>

      <!-- AI Configuration Modal -->
      <v-dialog v-model="showModal" max-width="500px">
        <v-card>
          <v-card-title class="headline"> AI Configuration </v-card-title>
          <v-divider></v-divider>
  
          <v-card-text>
            <v-text-field
              v-model="apiKey"
              type="password"
              label="Enter OpenAI API Key"
              outlined
              hint="Your API key will be securely stored"
              persistent-hint
              clearable
            ></v-text-field>
  
            <v-select v-model="selectedModel" :items="models" label="Select ChatGPT Model" outlined></v-select>
  
            <v-slider v-model="temperature" min="0" max="1" step="0.1" label="Temperature" thumb-label></v-slider>
  
            <v-text-field v-model="maxTokens" type="number" label="Max Tokens" outlined min="10" max="4096"></v-text-field>
  
            <v-switch v-model="streaming" label="Enable Streaming Mode"></v-switch>
          </v-card-text>
  
          <v-card-actions>
            <v-btn color="gray" @click="closeModal">Cancel</v-btn>
            <v-btn color="primary" @click="saveConfig" :loading="loading">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  const showModal = ref(false);
  const apiKey = ref("");
  const selectedModel = ref("gpt-4-turbo");
  const models = ["gpt-3.5-turbo", "gpt-4", "gpt-4o", "gpt-4-turbo"];
  const temperature = ref(0.7);
  const maxTokens = ref(1000);
  const streaming = ref(false);
  const loading = ref(false);
  const message = ref("");
  const messageType = ref("success");
  
  const configList = ref([]);
  const headers = [
    { title: "API Key", key: "apiKey" },
    { title: "Model", key: "model" },
    { title: "Temperature", key: "temperature" },
    { title: "Max Tokens", key: "maxTokens" },
    { title: "Streaming", key: "streaming" },
    { title: "Created At", key: "createdAt" },
  ];
  
  // Open Modal
  const openModal = () => {
    showModal.value = true;
  };
  
  // Close Modal
  const closeModal = () => {
    showModal.value = false;
  };
  
  // Save Configuration
  const saveConfig = async () => {
    loading.value = true;
    message.value = "";
  
    const config = {
      apiKey: apiKey.value,
      model: selectedModel.value,
      temperature: temperature.value,
      maxTokens: maxTokens.value,
      streaming: streaming.value
    };
  
    try {
      const response = await axios.post(
        "https://dark-caldron-448714-u5.uc.r.appspot.com/saveconfig",
        config
      );
  
      message.value = "Configuration saved successfully!";
      messageType.value = "success";
      fetchConfigs(); // Refresh table after saving
      closeModal();
    } catch (error) {
      message.value = "Failed to save configuration.";
      messageType.value = "error";
    } finally {
      loading.value = false;
    }
  };
  
  // Fetch AI Configurations
  const fetchConfigs = async () => {
  try {
    const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/listconfigs");

    console.log("Fetched Data:", response.data.apiKeys); // Debugging log

    if (Array.isArray(response.data.apiKeys)) {
      configList.value = response.data.apiKeys.map(item => ({
        apiKey: item.apiKey || "N/A",
        model: item.model || "N/A",
        temperature: item.temperature ?? "N/A",
        maxTokens: item.maxTokens ?? "N/A",
        streaming: item.streaming ?? false,
        createdAt: formatDate(item.createdAt),
      }));
    } else {
      console.error("Unexpected response format:", response.data);
    }
  } catch (error) {
    console.error("Error fetching configurations:", error);
  }
};

  
  // Format Date
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };
  
  // Fetch configurations on mount
  onMounted(() => {
    fetchConfigs();
  });
  </script>
  
  <style scoped>
  /* Custom Styles */
  </style>
  