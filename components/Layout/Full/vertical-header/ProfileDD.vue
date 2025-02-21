

<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn class="" variant="text" v-bind="props" icon>
        <v-avatar size="35">
          <img src="/images/profile/user-1.jpg" height="35" alt="user" />
        </v-avatar>
      </v-btn>
    </template>
    <v-sheet rounded="xl" width="200" elevation="10" class="mt-2">
      <v-list class="py-0" lines="one" density="compact">
        <!-- You can add more profile options here -->
      </v-list>
      <div class="pt-4 pb-4 px-5 text-center">
        <v-btn @click="logout" color="primary" variant="outlined" class="rounded-pill" block>
          Logout
        </v-btn>
      </div>
    </v-sheet>
  </v-menu>
</template>


<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("token"); // Remove the token
  router.push("/auth/login"); // Redirect to the login page
};
</script>