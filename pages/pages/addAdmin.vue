<template>
    <v-container>
        <v-row class="month-table">
            <v-col cols="12" sm="12">
                <UiChildCard title="Admin">
                    <!-- Add Admin Button -->
                    <v-btn color="primary" class="mb-3" @click="showDialog = true">
                        + Add Admin
                    </v-btn>

                    <!-- Add Admin Dialog -->
                    <v-dialog v-model="showDialog" max-width="400px">
                        <v-card>
                            <v-card-title>Add Admin</v-card-title>
                            <v-card-text>
                                <v-text-field 
                                    v-model="selectedEmail" 
                                    label="Enter User Email"
                                    clearable
                                    :error-messages="!isValidEmail && selectedEmail ? 'Invalid email format' : ''"
                                ></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="red" @click="showDialog = false">Cancel</v-btn>
                                <v-btn color="green" @click="addAdmin" :disabled="!isValidEmail && selectedEmail">Submit</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

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
                                    <th class="text-left">Admin Status</th>
                                    <th class="text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!loading && filteredStudents.length === 0">
                                    <td colspan="7" class="no-students">No Admin at the moment</td>
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
                                    <td :class="{'active-status': item.status === false, 'inactive-status': item.status === true}">
                                        {{ item.status === true ? "Inactive" : "Active" }}
                                    </td>
                                    <td :class="{'active-status': item.isAdmin === false, 'inactive-status': item.isAdmin === true}">
                                        {{ item.isAdmin === true ? "Temporary Access" : "Admin" }}
                                    </td>
                                    <td>
                                        <v-icon 
                                            v-if="item.isAdmin === true" 
                                            color="red" 
                                            @click="revokeAdmin(item.email, item.id)"
                                        >
                                            mdi-trash-can
                                        </v-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <div v-if="loading" class="loading-text">Loading more admin...</div>
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
const allStudents = ref([]);
const visibleStudents = ref([]);
const selectedUser = ref(null);
const showDialog = ref(false);
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);
const apiUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com/admins/";
const revokeAdminUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com/user/revokeAdmin";
const addAdminUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com/user/grantAdmin";
const selectedEmail = ref("")

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

const isValidEmail = computed(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(selectedEmail.value);
});

const loadMoreData = async () => {
    if (loading.value || !hasMore.value) return;
    loading.value = true;

    try {
        const response = await axios.get(`${apiUrl}?page=${page.value}`);
        if (response.data.length === 0) {
            hasMore.value = false;
        } else {
            const newStudents = response.data.filter(student => 
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

// Handle Admin Revocation
const revokeAdmin = async (email, adminId) => {
    try {
        await axios.put(revokeAdminUrl, {
            email: email,
            isAdmin: false
        });

        // Remove from UI after successful revocation
        allStudents.value = allStudents.value.filter(admin => admin.id !== adminId);
        visibleStudents.value = [...allStudents.value];

    } catch (error) {
        console.error("Error revoking admin:", error);
    }
};

// Handle Adding Admin
const addAdmin = async () => {
    if (!selectedEmail.value) {
        console.warn("No user selected.");
        return;
    }

    try {
        const response = await axios.put(addAdminUrl, {
            email: selectedEmail.value,
            isAdmin: true
        });

        // Update UI: Set isAdmin to true for selected user
        const userIndex = allStudents.value.findIndex(user => user.email === selectedEmail.value);
        if (userIndex !== -1) {
            allStudents.value[userIndex].isAdmin = true;
        }
        visibleStudents.value = [...allStudents.value];

        showDialog.value = false;
        selectedUser.value = null;
        loadMoreData();
    } catch (error) {
        console.error("Error adding admin:", error.response?.data || error.message);
    }
};


// Computed Property: Filters students by name or email
const filteredStudents = computed(() => {
    return visibleStudents.value.filter(student =>
        student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// Computed Property: List of Non-Admins for Selection
const nonAdmins = computed(() => {
    return allStudents.value
        .filter(student => !student.isAdmin)
        .map(student => ({
            email: student.email,
            name: `${student.name} (${student.email})`
        }));
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
