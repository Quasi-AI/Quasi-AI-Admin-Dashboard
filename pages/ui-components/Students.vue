<template>
    <v-container>
        <v-row class="month-table">
            <v-col cols="12" sm="12">
                <UiChildCard :title="`Students (${totalStudents})`">
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
                                    <th class="text-left">Sign Up date</th>
                                    <th class="text-left">Status</th>
                                    <th class="text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!loading && filteredStudents.length === 0">
                                    <td colspan="6" class="no-students">No students at the moment</td>
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
                                    <td>
                                        <!-- Action Icons -->
                                        <v-icon 
                                            v-if="!item.status" 
                                            @click="openDeleteDialog(item)" 
                                            color="red" 
                                            title="Delete User"
                                        >
                                            mdi-trash-can
                                        </v-icon>
                                        <v-icon 
                                            v-else 
                                            @click="activateUser(item.id)" 
                                            color="green" 
                                            title="Activate User"
                                        >
                                            mdi-account-check
                                        </v-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <div v-if="loading" class="loading-text">Loading more students...</div>
                    </div>
                </UiChildCard>
            </v-col>
        </v-row>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="400">
            <v-card>
                <v-card-title class="headline">Confirm Deletion</v-card-title>
                <v-card-text>
                    Are you sure you want to delete <strong>{{ selectedUser?.name }}</strong>? This action cannot be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey darken-1" text @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="red darken-1" text @click="confirmDelete">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import UiChildCard from '@/components/shared/UiChildCard.vue';

const searchQuery = ref("");
const allStudents = ref([]); 
const visibleStudents = ref([]);
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);
const apiUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com/students/";
const deleteAndActivaeApiUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com/profile/delete/";
const totalStudents = ref(0)

// Delete Dialog Data
const deleteDialog = ref(false);
const selectedUser = ref(null);

// Open Delete Confirmation Dialog
const openDeleteDialog = (user) => {
    selectedUser.value = user;
    deleteDialog.value = true;
};

// Confirm Deletion (Soft Delete: status = false)
const confirmDelete = async () => {
    if (!selectedUser.value) return;

    try {
        await axios.put(`${deleteAndActivaeApiUrl}${selectedUser.value.id}`, { 
            email: selectedUser.value.email,
            status: true
        });

        // Update the local state
        allStudents.value = allStudents.value.map(student => 
            student.id === selectedUser.value.id ? { ...student, status: true } : student
        );
        visibleStudents.value = [...allStudents.value];

    } catch (error) {
        console.error("Error deleting user:", error);
    } finally {
        deleteDialog.value = false;
    }
};

// Activate User (Reactivate: status = true)
const activateUser = async (userId, userEmail) => {
    try {
        await axios.put(`${deleteAndActivaeApiUrl}${userId}`, { 
            email: selectedUser.value.email,
            status: false
        });

        // Update the local state
        allStudents.value = allStudents.value.map(student => 
            student.id === userId ? { ...student, status: false } : student
        );
        visibleStudents.value = [...allStudents.value];

    } catch (error) {
        console.error("Error activating user:", error);
    }
};


// Load More Data
const loadMoreData = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;

    try {
        const response = await axios.get(`${apiUrl}?page=${page.value}`);

        if (response.data.length === 0) {
            hasMore.value = false;
        } else {
            totalStudents.value = response.data.totalStudents
            const newStudents = response.data.data.filter(student => 
                !allStudents.value.some(existing => existing.id === student.id)
            );

            if (newStudents.length === 0) {
                hasMore.value = false;
            } else {
                allStudents.value.push(...newStudents);
                visibleStudents.value = [...allStudents.value];
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
        .map((n) => n[0])
        .join("");
};

const formatDate = (isoString) => {
    if (!isoString) return "N/A"; // Handle empty dates
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
};

</script>

<style scoped>
.table-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
    position: relative;
}

.fixed-header {
    position: sticky;
    top: 0;
    background-color: white;
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

.active-status {
    color: green;
    font-weight: bold;
}

.inactive-status {
    color: red;
    font-weight: bold;
}
</style>
