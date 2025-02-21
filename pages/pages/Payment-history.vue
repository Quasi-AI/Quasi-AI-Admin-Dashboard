<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="12">
                <UiParentCard title="Payment History">
                    <v-card>
                        <div v-if="paymentHistory.length === 0" class="under-development">
                            <v-icon size="50" color="warning">mdi-alert-circle</v-icon>
                            <p class="text-h6 mt-2">Page Under Development</p>
                            <p class="text-body-2">We're working on this page. Please check back later.</p>
                        </div>

                        <div v-else class="table-container">
                            <v-table>
                                <thead>
                                    <tr class="header-row">
                                        <th>Profile</th>
                                        <th>Payer Name</th>
                                        <th>Email</th>
                                        <th>Amount Paid ($)</th>
                                        <th>Payment Date</th>
                                        <th>Next Payment Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="payment in paymentHistory" :key="payment.id">
                                        <td>
                                            <v-avatar size="40">
                                                <img :src="payment.profileImage" alt="Profile Image">
                                            </v-avatar>
                                        </td>
                                        <td>{{ payment.payerName }}</td>
                                        <td>{{ payment.email }}</td>
                                        <td>${{ payment.amountPaid.toFixed(2) }}</td>
                                        <td>{{ formatDate(payment.paymentDate) }}</td>
                                        <td>{{ formatDate(payment.nextPaymentDate) }}</td>
                                        <td :class="{'paid-status': payment.status === 'Paid', 'canceled-status': payment.status === 'Canceled'}">
                                            {{ payment.status }}
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </div>
                    </v-card>
                </UiParentCard>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

// Sample payment history data (set empty array to test 'under development' message)
const paymentHistory = ref([]);

// Function to format date into a readable format
const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};
</script>

<style scoped>
/* Scrollable table container */
.table-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
}

/* Align headers inline */
.header-row th {
    white-space: nowrap;
    text-align: center;
    padding: 12px;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
}

/* Status styles */
.paid-status {
    color: green;
    font-weight: bold;
}
.canceled-status {
    color: red;
    font-weight: bold;
}

/* Under Development Message */
.under-development {
    text-align: center;
    padding: 30px;
    color: #ff9800;
}
</style>
