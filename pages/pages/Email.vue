<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Send Email">
                <!-- Success and Error Messages -->
                <v-alert 
                    v-if="successMessage" 
                    type="success" 
                    dismissible 
                    @input="successMessage = ''"
                >
                    {{ successMessage }}
                </v-alert>

                <v-alert 
                    v-if="errorMessage" 
                    type="error" 
                    dismissible 
                    @input="errorMessage = ''"
                >
                    {{ errorMessage }}
                </v-alert>
                <v-container style="max-height: 80vh; overflow-y: auto;">
                    <v-form>
                        <v-text-field v-model="senderEmail" label="Sender Email" readonly></v-text-field>
                        <v-text-field v-model="recipientEmail" label="Recipient Email" required></v-text-field>
                        <v-text-field v-model="ccEmail" label="CC Email (Optional)"></v-text-field>
                        <v-text-field v-model="bccEmail" label="BCC Email (Optional)"></v-text-field>
                        <v-text-field v-model="subject" label="Subject" required></v-text-field>

                        <!-- Rich Text Editor (Quill) -->
                        <QuillEditor 
                            v-model:content="emailBody" 
                            theme="snow" 
                            content-type="html" 
                            style="height: 300px;"
                        ></QuillEditor>

                        <!-- File Attachments -->
                        <v-file-input multiple label="Attach Files" @change="handleFileUpload"></v-file-input>

                        <!-- Send Button -->
                        <v-btn :loading="loading" color="primary" @click="sendEmail">Send Email</v-btn>
                    </v-form>
                </v-container>
            </UiParentCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import axios from 'axios';
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const senderEmail = ref("info@quasiai.com");
const recipientEmail = ref("");
const ccEmail = ref("");
const bccEmail = ref("");
const subject = ref("");
const emailBody = ref(""); // Will hold Quill's content
const attachments = ref<File[]>([]);
const loading = ref(false);
const successMessage = ref(""); // Success message state
const errorMessage = ref(""); // Error message state

// Handle file upload
const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        attachments.value = Array.from(input.files);
    }
};

const sendEmail = async () => {
    if (!recipientEmail.value || !subject.value || !emailBody.value) {
        errorMessage.value = "Recipient, subject, and body are required!";
        autoDismissAlert();
        return;
    }

    loading.value = true;
    successMessage.value = "";
    errorMessage.value = "";

    try {
        const formData = new FormData();
        formData.append("from", senderEmail.value);
        formData.append("to", recipientEmail.value);
        if (ccEmail.value) formData.append("cc", ccEmail.value);
        if (bccEmail.value) formData.append("bcc", bccEmail.value);
        formData.append("subject", subject.value);
        formData.append("body", emailBody.value);
        attachments.value.forEach(file => formData.append("attachments", file));

        const response = await axios.post("https://dark-caldron-448714-u5.uc.r.appspot.com/send-email", formData);

        if (response.status === 200) {
            successMessage.value = "Email sent successfully!";
        } else {
            errorMessage.value = "Failed to send email. Try again.";
        }
    } catch (error) {
        errorMessage.value = "Email error: " + (error.response?.data?.message || error.message);
    } finally {
        loading.value = false;
        autoDismissAlert(); // Call the function to hide alerts automatically
    }
};

// Function to auto-dismiss alert messages
const autoDismissAlert = () => {
    setTimeout(() => {
        successMessage.value = "";
        errorMessage.value = "";
    }, 5000); // Alert disappears after 5 seconds
};


</script>
