<template>
    <v-btn icon variant="text" class="custom-hover-primary ml-0 ml-md-5 text-muted">
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
import axios from "axios";

const unreadCount = ref(0);

const fetchUnreadCount = async () => {
    try {
        const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/inbox");
        
        // Backend now only returns unseen emails, so count them directly
        unreadCount.value = response.data.length;
    } catch (error) {
        console.error("Failed to fetch unread emails:", error);
    }
};

onMounted(fetchUnreadCount);
</script>
