<template>
    <v-container>
        <v-row class="month-table">
            <v-col cols="12" sm="12">
                <UiChildCard title="Educators">
                    <!-- Search Input -->
                    <v-text-field v-model="searchQuery" label="Search by name or email" clearable prepend-inner-icon="mdi-magnify"></v-text-field>

                    <!-- Scrollable Table with Fixed Header -->
                    <div ref="scrollContainer" class="table-container" @scroll="handleScroll">
                        <v-table>
                            <thead class="fixed-header">
                                <tr>
                                    <th class="text-left">Profile</th>
                                    <th class="text-left">Name</th>
                                    <th class="text-left">Email</th>
                                    <th class="text-left">Sign up date</th>
                                    <th class="text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!loading && filteredStudents.length === 0">
                                    <td colspan="4" class="no-students">No Educators at the moment</td>
                                </tr>
                                <tr v-for="item in filteredStudents" :key="item.id">
                                    <td>
                                        <v-avatar size="40" class="avatar-container">
                                            <img v-if="item.profileImage" :src="item.profileImage" alt="Profile Image" class="avatar-image">
                                            <span v-else class="avatar-initials">{{ getInitials(item.name) }}</span>
                                        </v-avatar>
                                    </td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.email }}</td>
                                    <td>{{ formatDate(item.date) }}</td>
                                    <td :class="{'active-status': !item.status, 'inactive-status': item.status}">
                                        {{ item.status ? "Inactive" : "Active" }}
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <div v-if="loading" class="loading-text">Loading more educators...</div>
                    </div>
                </UiChildCard>
            </v-col>
        </v-row>
    </v-container>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import UiChildCard from '@/components/shared/UiChildCard.vue';

const searchQuery = ref("");
const allStudents = ref([]); // Holds all students fetched from API
const visibleStudents = ref([]); // Data shown on screen
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);
const apiUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com/educators/";


const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
};

const loadMoreData = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;

    try {
        const response = await axios.get(`${apiUrl}?page=${page.value}`);

        if (response.data.length === 0) {
            hasMore.value = false;
        } else {
            // 🔥 Ensure no duplicates by using a Set
            const newStudents = response.data.filter(student => 
                !allStudents.value.some(existing => existing.id === student.id)
            );

            if (newStudents.length === 0) {
                hasMore.value = false;
            } else {
                allStudents.value.push(...newStudents);
                visibleStudents.value = [...allStudents.value]; // Update visible students
                page.value++;
            }
        }
    } catch (error) {
        console.error("Error fetching students:", error);
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

// Computed Property: Filters students by name or email
const filteredStudents = computed(() => {
    return visibleStudents.value.filter(student =>
        student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// Fetch initial data
onMounted(() => {
    loadMoreData();
});

// Get Initials for Users Without Profile Image
const getInitials = (name) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .join("");
};
</script>

<style scoped>
.table-container {
    max-height: 400px; /* Set max height */
    overflow-y: auto; /* Enable scrolling */
    border: 1px solid #ddd;
    position: relative;
}

.fixed-header {
    position: sticky;
    top: 0;
    background-color: white; /* Ensure header is visible */
    z-index: 10;
}

.loading-text, .no-students {
    text-align: center;
    padding: 15px;
    font-weight: bold;
}

.no-students {
    color: #888;
    font-size: 16px;
}

.avatar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ccc;
    color: white;
    font-weight: bold;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.avatar-initials {
    font-size: 16px;
    text-transform: uppercase;
}

/* Active & Inactive Status Colors */
.active-status {
    color: green;
    font-weight: bold;
}

.inactive-status {
    color: red;
    font-weight: bold;
}

</style>
