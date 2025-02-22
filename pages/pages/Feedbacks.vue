<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Feedback Page">
                <div>
                    <p class="text-body-1">See people's concerns, ideas, and suggestions for improving the AI.</p>
                </div>

                <v-divider class="my-4"></v-divider>

                <h3>Feedback Received</h3>

                <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
                <v-progress-circular v-if="loading" indeterminate></v-progress-circular>

                <div class="table-container" v-if="!loading && feedbackList.length">
                    <v-table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="feedback in feedbackList" 
                                :key="feedback.id" 
                                @click="openDialog(feedback)"
                                class="clickable-row"
                            >
                                <td>{{ feedback.name }}</td>
                                <td>{{ feedback.email }}</td>
                                <td class="message-column">
                                    <span>{{ feedback.message.slice(0, 100) }}...</span>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>

                <p v-else-if="!loading">No feedback received yet.</p>
            </UiParentCard>
        </v-col>

        <!-- Dialog to show full message -->
        <v-dialog v-model="dialogVisible" max-width="600px">
            <v-card>
                <v-card-title>Feedback Message</v-card-title>
                <v-card-text class="scrollable-content">
                    <p><strong>Name:</strong> {{ selectedFeedback?.name }}</p>
                    <p><strong>Email:</strong> {{ selectedFeedback?.email }}</p>
                    <p><strong>Message:</strong></p>
                    <div class="message-box">{{ selectedFeedback?.message }}</div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="dialogVisible = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import UiParentCard from "@/components/shared/UiParentCard.vue";

interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
}

const feedbackList = ref<Feedback[]>([]);
const dialogVisible = ref(false);
const selectedFeedback = ref<Feedback | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchFeedbacks = async () => {
  try {
    const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/feedbacks");
    feedbackList.value = response.data;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const openDialog = (feedback: Feedback) => {
  selectedFeedback.value = feedback;
  dialogVisible.value = true;
};

onMounted(fetchFeedbacks);

</script>

<style scoped>
h3 {
    margin-top: 20px;
}

/* Make the table scrollable */
.table-container {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
}

/* Ensure table columns maintain their width */
th, td {
    white-space: nowrap;
    padding: 10px;
    text-align: left;
}

/* Clickable row effect */
.clickable-row {
    cursor: pointer;
    transition: background 0.2s ease-in-out;
}

.clickable-row:hover {
    background: #f5f5f5;
}

/* Ensure long messages do not break layout */
.message-column {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Style for scrollable message */
.message-box {
    max-height: 200px;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

/* Make table scroll horizontally */
.v-table {
    display: block;
    overflow-x: auto;
    max-width: 100%;
}

/* Scrollable dialog content */
.scrollable-content {
    max-height: 300px;
    overflow-y: auto;
}
</style>
