<template>
    <div>
      <v-row class="mb-3">
        <v-col cols="12">
          <v-label class="font-weight-medium mb-1">Email</v-label>
          <v-text-field v-model="email" variant="outlined" class="pwdInput" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label class="font-weight-medium mb-1">Password</v-label>
          <v-text-field v-model="password" variant="outlined" type="password" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn size="large" rounded="pill" color="primary" block @click="login">Sign In</v-btn>
        </v-col>
      </v-row>
  
      <!-- V-Alert for Messages -->
      <v-alert v-if="alertMessage" :type="alertType" class="mt-3" closable>{{ alertMessage }}</v-alert>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  
  const email = ref("");
  const password = ref("");
  const alertMessage = ref("");
  const alertType = ref("error");
  const router = useRouter();
  
  const login = async () => {
    try {
      const response = await axios.post("https://dark-caldron-448714-u5.uc.r.appspot.com/admin/login", {
        email: email.value,
        password: password.value,
      });
  
      // Ensure response follows expected format
      if (response.data.statusCode === 200) {
        localStorage.setItem("token", response.data.token);
        alertMessage.value = "Login successful!";
        alertType.value = "success";
  
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        alertMessage.value = response.data.message || "Login failed!";
        alertType.value = "error";
      }
    } catch (error) {
      // Handle server and network errors
      if (error.response) {
        alertMessage.value = error.response.data.message || "Invalid credentials!";
      } else {
        alertMessage.value = "Server error. Please try again later!";
      }
      alertType.value = "error";
    }
  };
  </script>
  


