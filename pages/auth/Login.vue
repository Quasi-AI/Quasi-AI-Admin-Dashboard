<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// ✅ Define Page Layout
definePageMeta({
  layout: "blank",
});

// ✅ Reactive Variables
const email = ref("");
const password = ref("");
const alertMessage = ref("");
const alertType = ref("error");
const router = useRouter();

// ✅ Regex Patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ✅ Validation Computed Properties
const emailError = computed(() => {
  if (!email.value) return "Email is required!";
  if (!emailPattern.test(email.value)) return "Enter a valid email!";
  return "";
});

const passwordError = computed(() => {
  if (!password.value) return "Password is required!";
  if (!passwordPattern.test(password.value))
    return "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character!";
  return "";
});

const isFormValid = computed(() => !emailError.value && !passwordError.value);

// ✅ Login Function
const login = async () => {
  if (!isFormValid.value) return; // Prevent API call if form is invalid

  try {
    const response = await axios.post("https://dark-caldron-448714-u5.uc.r.appspot.com/admin/login", {
      email: email.value,
      password: password.value,
    });

    if (response.data.statusCode === 200) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
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
    if (error.response) {
      alertMessage.value = error.response.data.message || "Invalid credentials!";
    } else {
      alertMessage.value = "Server error. Please try again later!";
    }
    alertType.value = "error";
  }
};
</script>

<template>
  <div class="authentication">
    <v-container fluid class="pa-3">
      <v-row class="h-100vh d-flex justify-center align-center">
        <v-col cols="12" md="8" lg="6" xl="5" class="d-flex justify-center">
          <div class="boxed-auth-wrap">
            <v-card rounded="xl" class="auth-card px-sm-5 px-4 mx-auto" max-width="750">
              <v-card-item class="pa-6">
                <!-- ✅ LOGO -->
                <div class="logo-container">
                  <img src="/images/logos/logo.png" alt="Logo" class="logo-img" />
                </div>

                <!-- ✅ LOGIN FORM -->
                <v-row class="w-full mb-3">
                  <v-col cols="12">
                    <v-label class="font-weight-medium mb-1">Email</v-label>
                    <v-text-field 
                      v-model="email" 
                      variant="outlined" 
                      class="pwdInput" 
                      hide-details 
                      color="primary"
                      :error-messages="emailError"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-label class="font-weight-medium mb-1">Password</v-label>
                    <v-text-field 
                      v-model="password" 
                      variant="outlined" 
                      type="password" 
                      hide-details 
                      color="primary"
                      :error-messages="passwordError"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-btn size="large" rounded="pill" color="primary" block @click="login" :disabled="!isFormValid">
                      Sign In
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- ✅ FIXED ALERT (INSIDE THE CARD) -->
                <v-alert v-if="alertMessage" :type="alertType" class="alert-box" closable dense>
                  {{ alertMessage }}
                </v-alert>

              </v-card-item>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
/* ✅ Full-screen height */
.h-100vh {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✅ Authentication Card - Increased Width */
.auth-card {
  width: 100%;
  max-width: 750px;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ✅ Prevents content shift */
.auth-card .v-card-item {
  min-height: 420px;
}

/* ✅ Ensures consistent spacing */
.pa-6 {
  padding: 24px !important;
}

/* ✅ LOGO CONTAINER */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

/* ✅ LOGO IMAGE - Properly Sized */
.logo-img {
  max-width: 140px;
  height: auto;
}

/* ✅ ALERT INSIDE CARD */
.alert-box {
  width: 100%;
  font-size: 14px;
  text-align: center;
  min-height: 40px;
  margin-top: 10px;
}

/* ✅ Boxed Auth Wrap - Set Fixed Dimensions */
.boxed-auth-wrap {
  width: 500px;
  height: 580px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
