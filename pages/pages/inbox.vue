<template>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="Inbox">
                <!-- Error Alert -->
                <v-alert v-if="errorMessage" type="error" dismissible>{{ errorMessage }}</v-alert>

                <!-- Loading Indicator -->
                <v-progress-linear v-if="loading" indeterminate></v-progress-linear>

                <!-- Scrollable Table -->
                <v-sheet style="max-height: 400px; overflow-y: auto;">
                    <v-table v-if="!loading">
                        <thead>
                            <tr>
                                <th>Sender</th>
                                <th>Subject</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="email in emails" 
                                :key="email.date"
                                @click="openEmail(email)"
                                class="clickable-row"
                            >
                                <td>{{ email.from }}</td>
                                <td>{{ email.subject }}</td>
                                <td>{{ formatDate(email.date) }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-sheet>

                <!-- Email Body Modal -->
                <v-dialog v-model="showModal" max-width="600px">
                    <v-card>
                        <v-card-title class="headline">{{ selectedEmail.subject }}</v-card-title>
                        <v-card-subtitle>From: {{ selectedEmail.from }}</v-card-subtitle>
                        <v-card-subtitle>Date: {{ formatDate(selectedEmail.date) }}</v-card-subtitle>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-sheet class="email-body">
                                            <div v-html="formattedEmailBody"></div>
                                        </v-sheet>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" text @click="showModal = false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </UiParentCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { computed } from "vue";


// Reactive variables
const emails = ref<{ from: string; subject: string; date: string; body: string }[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const showModal = ref(false);
const selectedEmail = ref({ from: "", subject: "", date: "", body: "" });

const lastFetchedEmail = ref<string | null>(null);


// Computed property to format email body
const formattedEmailBody = computed(() => {
    if (!selectedEmail.value.body) return "";

    return selectedEmail.value.body
        .replace(/\n/g, "<br>") // Convert new lines to HTML line breaks
        .replace(/\s{2,}/g, "&nbsp;&nbsp;"); // Convert multiple spaces to non-breaking spaces
});

const fetchEmails = async () => {
    try {
        const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/inbox");
        
        // Sort emails by latest first
        const sortedEmails = response.data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Update emails list
        emails.value = sortedEmails;

        // Store latest email date
        lastFetchedEmail.value = sortedEmails.length > 0 ? sortedEmails[0].date : null;
    } catch (error) {
        errorMessage.value = "Failed to load emails";
    } finally {
        loading.value = false;
    }
};


// Open modal with email content
const openEmail = (email: { from: string; subject: string; date: string; body: string }) => {
    selectedEmail.value = email;
    showModal.value = true;
};

// Format date for better readability
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
};

// Fetch new emails every 30 seconds
onMounted(() => {
    fetchEmails();
    setInterval(fetchEmails, 30000); // Check for new emails every 30 seconds
});
</script>

<style scoped>
/* Add hover effect */
.clickable-row {
    cursor: pointer;
}

.clickable-row:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.email-body {
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    white-space: pre-wrap;
    word-wrap: break-word;
    background: #fafafa;
    padding: 10px;
    border-radius: 8px;
}
</style>
