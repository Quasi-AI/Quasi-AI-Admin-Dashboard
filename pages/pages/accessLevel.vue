<template>
    <v-container>
        <v-alert v-if="alertMessage" :type="alertType" dismissible class="mb-3">
            {{ alertMessage }}
        </v-alert>
        <v-row class="month-table">
            <v-col cols="12" sm="12">
                <UiChildCard title="Admin">
                    <!-- Add Admin Button -->
                    <v-btn color="primary" class="mb-3" @click="showDialog = true">
                        + Add Access Level
                    </v-btn>

                    <!-- Search Input -->
                    <v-text-field v-model="searchQuery" label="Search by name" clearable prepend-inner-icon="mdi-magnify"></v-text-field>

                    <!-- Scrollable Table with Expandable Rows -->
                    <div ref="scrollContainer" class="table-container" @scroll="handleScroll">
                        <v-table>
                            <thead class="fixed-header">
                                <tr>
                                    <th class="text-left">Access level name</th>
                                    <th class="text-left">Role</th>
                                    <th class="text-left">Dates</th>
                                    <th class="text-left">Status</th>
                                    <th class="text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!loading && filteredAccess.length === 0">
                                    <td colspan="7" class="no-access">No Access Level at the moment</td>
                                </tr>
                                <template v-for="item in filteredAccess" :key="item.id">
                                    <tr @click="toggleExpand(item.id)">
                                        <td>{{ item.name }}</td>
                                        <td>{{ item.role }}</td>
                                        <td>{{ formatDate(item.createdAt) }}</td>
                                        <td :class="{'active-status': !item.status, 'inactive-status': item.status}">
                                            {{ item.status ? "Inactive" : "Active" }}
                                        </td>
                                        <td>
                                            <v-btn 
                                                :icon="expandedRow === item.name ? 'mdi-eye-off' : 'mdi-eye'"
                                                @click.stop="toggleExpand(item.name)">
                                            </v-btn>
                                        </td>
                                    </tr>
                                    <tr v-if="expandedRow === item.name" class="expanded-row">
                                        <td colspan="7" class="expanded-content">
                                            <v-container fluid>
                                            <v-row dense>
                                                <!-- Permissions Section -->
                                                <v-col cols="4">
                                                <v-card elevation="2" class="pa-4 card-container">
                                                    <strong class="title">Permissions</strong>
                                                    <v-divider class="my-2"></v-divider>
                                                    <v-list dense class="scrollable-list">
                                                    <v-list-item v-for="(value, key) in item.permissions" :key="key">
                                                        <v-list-item-icon>
                                                        <v-icon :color="value ? 'green' : 'red'">
                                                            {{ value ? 'mdi-check-circle' : 'mdi-close-circle' }}
                                                        </v-icon>
                                                        </v-list-item-icon>
                                                        <v-list-item-content>
                                                        <v-list-item-title>{{ key }}</v-list-item-title>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                    </v-list>
                                                </v-card>
                                                </v-col>

                                                <!-- Users Section -->
                                                <v-col cols="8">
                                                <v-card elevation="2" class="pa-4 card-container">
                                                    <strong class="title">Users</strong>
                                                    <v-divider class="my-2"></v-divider>
                                                    <div class="scrollable-list">
                                                    <v-table density="compact">
                                                        <thead>
                                                        <tr>
                                                            <th>Profile</th>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr v-for="user in item.users" :key="user.email">
                                                            <td>
                                                            <v-avatar size="40">
                                                                <v-img v-if="user.profile" :src="user.profile" alt="Profile Image" />
                                                                <span v-else class="avatar-initials">{{ getInitials(user.name) }}</span>
                                                            </v-avatar>
                                                            </td>
                                                            <td>{{ user.name }}</td>
                                                            <td>{{ user.email }}</td>
                                                        </tr>
                                                        </tbody>
                                                    </v-table>
                                                    </div>
                                                </v-card>
                                                </v-col>
                                            </v-row>
                                            </v-container>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </v-table>
                        <div v-if="loading" class="loading-text">Loading more access levels...</div>
                    </div>
                </UiChildCard>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog v-model="showDialog" max-width="600px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Add Access Level</span>
            </v-card-title>

            <v-card-text>
                <v-form ref="form">
                <!-- Access Level Name -->
                <v-text-field label="Access Level Name" v-model="accessLevel.name" required></v-text-field>

                <!-- Role -->
                <v-select
                    label="Role"
                    v-model="accessLevel.role"
                    :items="['Student', 'Educator', 'admin']"
                    required
                ></v-select>

                <!-- Users Multi-Select -->
                <v-autocomplete
                    v-model="selectedUsers"
                    label=""
                    placeholder=""
                    :items="allusers"
                    item-title="name"
                    item-text="name"
                    item-value="email"
                    multiple
                    return-object
                    required
                    clearable
                    hide-no-data
                    hide-details
                    solo
                    >
                </v-autocomplete>


                <!-- Permissions (Checkboxes) -->
                <v-container>
                    <v-row>
                    <v-col cols="5" v-for="(value, key) in accessLevel.permissions" :key="key">
                        <v-checkbox v-model="accessLevel.permissions[key]" :label="formatPermissionLabel(key)"></v-checkbox>
                    </v-col>
                    </v-row>
                </v-container>
                </v-form>
            </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="showDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="submitAccessLevel">Save</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import UiChildCard from '@/components/shared/UiChildCard.vue';

const searchQuery = ref("");
const allAccess = ref([]);
const visibleAccess = ref([]);
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);
const expandedRow = ref(null);
const alertMessage = ref("");
const alertType = ref("success"); // Can be 'success' or 'error'

const apiUrl = "https://dark-caldron-448714-u5.uc.r.appspot.com/access/";

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

        if (!response.data.data || response.data.data.length === 0) {
            hasMore.value = false;
        } else {
            // Ensure no duplicates
            const newAccess = response.data.data.filter(access => 
                !allAccess.value.some(existing => existing._id === access._id)
            );

            if (newAccess.length === 0) {
                hasMore.value = false;
            } else {
                allAccess.value.push(...newAccess);
                visibleAccess.value = [...allAccess.value]; // Update visible access levels
                page.value++;
            }
        }
    } catch (error) {
        console.error("Error fetching access levels:", error);
    } finally {
        loading.value = false;
    }
};


// Handle Row Expansion
const toggleExpand = (name) => {
    expandedRow.value = expandedRow.value === name? null : name;
};

// Preview Data
const previewPermissions = (permissions) => {
    if (!permissions) return "None"; // Handle undefined/null cases
    if (Array.isArray(permissions)) { 
        return permissions.length > 2 ? permissions.slice(0, 2).join(", ") + "..." : permissions.join(", ");
    }
    if (typeof permissions === "object") { 
        return Object.entries(permissions)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
    }
    return permissions.toString(); // Fallback for unexpected types
};

const previewUsers = (users) => {
    if (!users || users.length === 0) return "None";
    return users.length > 2 ? users.slice(0, 2).join(", ") + "..." : users.join(", ");
};

// Computed: Filter Access Levels
const filteredAccess = computed(() => {
    return visibleAccess.value.filter(access =>
        access.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// Fetch Initial Data
// Get Initials for Users Without Profile Image
const getInitials = (name) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .join("");
};


//create access level

const showDialog = ref(false);
const allusers = ref([]);
const selectedUsers = ref([]);
const accessLevel = ref({
  name: "",
  role: "Student",
  users: [],
  permissions: {
    canViewCourses: false,
    canEnrollInCourse: false,
    canAddCourse: false,
    canViewAnalytics: false,
    canAddInstructor: false,
    canUpdateCourseContent: false,
    canGradeAssignments: false,
    canManageCourseMaterials: false,
    canViewGrades: false,
    canViewProfile: false,
    canManageUsers: false,
    canAddAdminPermissions: false,
    canViewInstructors: false,
    canManageCourses: false,
    canViewCourseList: false,
    canManageCourseSettings: false,
    canReserveClassroom: false,
    canRequestAssistance: false,
    canPostAnnouncements: false,
    canViewAnnouncements: false,
    canViewAssignments: false,
    canSubmitAssignment: false,
    canViewPaymentHistory: false,
    canAddNotifications: false,
    canViewNotifications: false,
    canManageSettings: false,
    canManageQuestions: false,
    canCreateQuizzes: false,
    canAccessFlashcards: false,
    canCreateFlashcards: false,
    canPlayLearningGames: false,
    canLearnHowToCode: false,
    dashboard: false,
    aiAnalytics: false,
    aiConfig: false,
    databaseManagement: false,
    students: false,
    studentReports: false,
    educators: false,
    educatorReports: false,
    payments: false,
    invoices: false,
    financialOverview: false,
    admin: false,
    addAdmin: false,
    accessLevel: false,
    securityLogs: false,
    management: false,
    emailManagement: false,
    inbox: false,
    feedbacks: false,
    systemLogs: false
  }
});

async function fetchUsers() {
  try {
    const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/all-users/");
    console.log("Full API response:", response.data);

    if (!response.data || !Array.isArray(response.data.data)) {
      console.error("Unexpected API response structure:", response.data);
      return;
    }

    allusers.value = response.data.data.map(user => ({
      email: user.email,
      name: user.name || "Unknown",
    }));

    console.log("Processed Users:", allusers.value);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}


const isValidUrl = (url) => {
  try {
    return new URL(url).protocol.startsWith("http");
  } catch (e) {
    return false;
  }
};


function formatPermissionLabel(key) {
  return key.replace(/([A-Z])/g, " $1").trim(); // Formats camelCase to readable text
}

async function submitAccessLevel() {
  const payload = {
    ...accessLevel.value,
    users: selectedUsers.value.map(user => ({
      email: user.email,
      name: user.name,
      profile: user.profile || ""
    }))
  };

  try {
    const response = await axios.post(
      "https://dark-caldron-448714-u5.uc.r.appspot.com/access/create",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    // Show success alert
    showAlert("Access Level Created Successfully!", "success");

    showDialog.value = false; // Close dialog
  } catch (error) {
    console.error("Error creating access level:", error.response?.data || error.message);

    // Show error alert
    showAlert(error.response?.data?.message || "Failed to create access level!", "error");
  }
}

function showAlert(message, type) {
  alertMessage.value = message;
  alertType.value = type;
  loadMoreData();

  // Auto-hide alert after 3 seconds
  setTimeout(() => {
    alertMessage.value = "";
  }, 3000);
}


onMounted(() => {
    loadMoreData();
    fetchUsers();
});
</script>

<style scoped>
.avatar-initials {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  font-weight: bold;
  border-radius: 50%;
}

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

.loading-text, .no-access {
    text-align: center;
    padding: 15px;
    font-weight: bold;
}

.no-access {
    color: #888;
    font-size: 16px;
}

.active-status {
    color: green;
    font-weight: bold;
}

.inactive-status {
    color: red;
    font-weight: bold;
}

.expanded-content {
  background: #f9f9f9;
  padding: 16px;
  border-top: 2px solid #ddd;
}

.card-container {
  height: 250px; /* Fixed height */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.scrollable-list {
  flex-grow: 1;
  overflow-y: auto;
  max-height: 200px; /* Scrollable area height */
}

.title {
  font-size: 16px;
  font-weight: bold;
}
</style>
