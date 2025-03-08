<template>
    <v-btn 
        icon 
        variant="text" 
        class="custom-hover-primary ml-0 ml-md-5 text-muted"
        @click="goToInbox"
    >
        <v-badge
            v-if="unreadCount > 0"
            :content="unreadCount"
            color="primary" 
            offset-x="-5" 
            offset-y="-3"
        >
            <BellRingingIcon stroke-width="1.5" size="22" />
        </v-badge>
        <BellRingingIcon v-else stroke-width="1.5" size="22" />
    </v-btn>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const unreadCount = ref(0);
const router = useRouter();

const fetchUnreadCount = async () => {
    try {
        const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/inbox");
        unreadCount.value = response.data.length;
    } catch (error) {
        console.error("Failed to fetch unread emails:", error);
    }
};

const goToInbox = () => {
    router.push("/pages/inbox");  // Navigate to the inbox page
};

onMounted(fetchUnreadCount);
</script>
