<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="12">
                <UiParentCard :title="`Payment History(${totalPayments})`">
                    <v-text-field 
                        v-model="searchQuery" 
                        label="Search by payer name or email" 
                        clearable 
                        prepend-inner-icon="mdi-magnify">
                    </v-text-field>

                    <v-card>
                        <div ref="scrollContainer" class="table-container" @scroll="handleScroll">
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
                                    <tr v-if="!loading && filteredPayments.length === 0">
                                        <td colspan="7" class="no-data">No payments found</td>
                                    </tr>
                                    <tr v-for="payment in filteredPayments" :key="payment.id">
                                        <td>
                                            <v-avatar size="40" class="avatar-container">
                                                <img v-if="payment.profileImage" :src="payment.profileImage" alt="Profile Image" class="avatar-image">
                                                <span v-else class="avatar-initials">{{ getInitials(payment.payerName) }}</span>
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
                            <div v-if="loading" class="loading-text">Loading more payments...</div>
                        </div>
                    </v-card>
                </UiParentCard>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from "axios";
import UiParentCard from '@/components/shared/UiParentCard.vue';

const searchQuery = ref("");
const allPayments = ref([]); // Holds all payments fetched from API
const visiblePayments = ref([]); // Data shown on screen
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);
const apiUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com/getAllPaymentHistory";
const totalPayments = ref(0)
// Format date to a readable format
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

const loadMoreData = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;

    try {
        const response = await axios.get(`${apiUrl}?page=${page.value}`);

        // Ensure response data exists and is an array
        const payments = response.data.data;
        
        if (payments.length === 0) {
            hasMore.value = false;
        } else {
            totalPayments.value = payments.totalPayments;
            // Avoid duplicates
            const newPayments = payments.filter(payment => 
                !allPayments.value.some(existing => existing.id === payment.id)
            );

            if (newPayments.length === 0) {
                hasMore.value = false;
            } else {
                allPayments.value.push(...newPayments);
                visiblePayments.value = [...allPayments.value]; // Update visible list
                page.value++;
            }
        }
    } catch (error) {
        console.error("Error fetching payment history:", error);
    } finally {
        loading.value = false;
    }
};


// Lazy Load on Scroll
const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreData();
    }
};

// Computed Property: Filters payments by name or email
const filteredPayments = computed(() => {
    return visiblePayments.value.filter(payment =>
        payment.payerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        payment.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// Fetch initial data
onMounted(() => {
    loadMoreData();
});

// Get Initials for Users Without Profile Image
const getInitials = (name: string) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("");
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

/* Align headers */
.header-row th {
    white-space: nowrap;
    text-align: center;
    padding: 12px;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
}

/* No data message */
.no-data {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #888;
    padding: 20px;
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

/* Loading message */
.loading-text {
    text-align: center;
    padding: 10px;
    font-size: 14px;
    color: #666;
}

/* Avatar styles */
.avatar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    border-radius: 50%;
    width: 40px;
    height: 40px;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.avatar-initials {
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    color: #555;
}
</style>
