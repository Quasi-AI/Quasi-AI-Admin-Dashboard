<script setup lang="ts">
import { RouterLink } from 'vue-router';
import logolight from '/images/logos/logo.png';

</script>
<template>
    <div class="logo">
        <NuxtLink to="/">
            <img :src="logolight" alt="home" />
        </NuxtLink>
    </div>
</template>
<style scoped>
.logo img {
    width: 150px; /* Adjust as needed */
    height: auto; /* Maintain aspect ratio */
    max-width: 100%;
}
</style>