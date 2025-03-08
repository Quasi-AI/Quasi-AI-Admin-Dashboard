<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-avatar v-bind="props" size="35" class="text-black d-flex align-center justify-center">
        <span v-if="userInitials">{{ userInitials }}</span>
      </v-avatar>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userInitials = ref<string | null>(null);

const getUserInitials = () => {
  const fullName = localStorage.getItem("name");

  if (fullName) {
    // Extract initials
    const names = fullName.split(" ");
    userInitials.value = names.map((n) => n[0]).join("").toUpperCase();
  } else {
    userInitials.value = "U"; // Default if no name is stored
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name"); // Remove name as well
  router.push("/auth/login");
};

onMounted(getUserInitials);
</script>

<style scoped>
.v-avatar {
  font-size: 16px;
  font-weight: bold;
  cursor: pointer; /* Ensures it's clickable */
}
</style>
