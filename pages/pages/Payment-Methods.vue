<template>
    <v-row>
        <v-col cols="12">
            <!-- Development Banner -->
            <v-alert type="warning" icon="mdi-alert" prominent border="left">
                🚧 This page is currently under development. Some features may not be available yet.
            </v-alert>
        </v-col>

        <v-col cols="12" md="12">
            <UiParentCard title="Payment Methods">
                <!-- Existing Payment Methods -->
                <div class="mb-4">
                    <p class="text-body-1 font-weight-bold">Saved Payment Methods:</p>
                    <v-list dense>
                        <v-list-item v-for="method in paymentMethods" :key="method.id">
                            <v-list-item-content>
                                <v-list-item-title>{{ method.name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ method.details }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </div>

                <!-- Add New Payment Method -->
                <div class="mt-5">
                    <p class="text-body-1 font-weight-bold">Add a New Payment Method:</p>
                    <v-form @submit.prevent="addPaymentMethod">
                        <v-text-field v-model="newMethod.name" label="Payment Method" required></v-text-field>
                        <v-text-field v-model="newMethod.details" label="Details" required></v-text-field>
                        <v-btn color="primary" type="submit">Add Payment Method</v-btn>
                    </v-form>
                </div>
            </UiParentCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const paymentMethods = ref([
    { id: 1, name: "Credit Card", details: "Visa ending in 1234" },
    { id: 2, name: "PayPal", details: "test.doe@example.com" }
]);

const newMethod = ref({ name: "", details: "" });

const addPaymentMethod = () => {
    if (newMethod.value.name && newMethod.value.details) {
        paymentMethods.value.push({
            id: paymentMethods.value.length + 1,
            name: newMethod.value.name,
            details: newMethod.value.details
        });
        newMethod.value = { name: "", details: "" }; // Reset form
    }
};
</script>
