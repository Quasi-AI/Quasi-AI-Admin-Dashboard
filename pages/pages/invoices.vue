<template>
    <v-container>
      <v-card class="pa-4 white-bg">
        <v-card-title class="text-h5">Invoices</v-card-title>
  
        <!-- Search & Filter -->
        <v-row class="mt-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              label="Search by Email"
              clearable
              prepend-inner-icon="mdi-magnify">
            </v-text-field>
          </v-col>
        </v-row>
  
        <!-- Invoices Table -->
        <div class="table-container">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Invoice #</th>
                <th class="text-left">Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">Plan</th>
                <th class="text-left">Amount</th>
                <th class="text-left">Date</th>
                <th class="text-left">Status</th>
                <th class="text-left">Download</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invoice in filteredInvoices" :key="invoice._id">
                <td>{{ invoice.invoiceNumber }}</td>
                <td>{{ invoice.payerName }}</td>
                <td>{{ invoice.email }}</td>
                <td :class="{
                    'text-premium': invoice.plan === 'Premium', 
                    'text-free': invoice.plan === 'Free'
                  }">
                  {{ invoice.plan }}
                </td>
                <td>${{ invoice.amountPaid }}</td>
                <td>{{ formatDate(invoice.paymentDate) }}</td>
                <td :class="{
                    'text-success': invoice.status === 'Paid', 
                    'text-error': invoice.status === 'Failed'
                  }">
                  {{ invoice.status }}
                </td>
                <td>
                  <v-btn icon color="primary" @click="downloadInvoice(invoice)">
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
  
        <!-- Loading Indicator -->
        <div v-if="loading" class="text-center mt-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import jsPDF from 'jspdf';
  
  const invoices = ref([]);
  const searchQuery = ref('');
  const loading = ref(true);
  
  // ✅ Fetch invoices from API
  const fetchInvoices = async () => {
    try {
      const response = await axios.get("https://dark-caldron-448714-u5.uc.r.appspot.com/getAllPaymentHistory");
      invoices.value = response.data.data.map((item, index) => ({
        invoiceNumber: `INV-${String(index + 1).padStart(5, '0')}`,
        ...item
      }));
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      loading.value = false;
    }
  };
  
  // ✅ Computed properties for filtering invoices
  const filteredInvoices = computed(() => {
    return invoices.value.filter(invoice =>
      invoice.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  // ✅ Format Date Function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };
  
// ✅ Convert Image URL to Base64 (Handles Local & Remote Images)
const getBase64Image = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to load image");

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    return null;
  }
};

// ✅ Generate and Download Invoice as PDF
const downloadInvoice = async (invoice) => {
  if (!process.client) return;

  const doc = new jsPDF();
  const safeText = (value: any) => (value ? String(value) : "N/A");

  // ✅ Load Local Logo (Correct Way)
  const logoUrl = `${window.location.origin}/invoice-logo.png`; // Fetch from /public folder
  const imageBase64 = await getBase64Image(logoUrl);

  // ✅ Add Logo (Only if it loads successfully)
  if (imageBase64) {
    doc.addImage(imageBase64, "PNG", 15, 10, 15, 15);
  } else {
    console.warn("⚠ Logo could not be loaded. Proceeding without logo.");
  }

  // ✅ Apply Brand Color (#8C71FF)
  doc.setTextColor(140, 113, 255);
  doc.setFontSize(16);
  doc.text("Quasi AI", 140, 15);
  doc.setFontSize(10);
  doc.text("DeReimer 10475", 140, 22);
  doc.text("Bronx, USA", 140, 27);
  doc.text("Email: info@quasiai.com", 140, 32);
  doc.text("Phone: +1 (631) 805-9702", 140, 37);
  doc.line(15, 42, 195, 42);

  // ✅ Invoice Title
  doc.setFontSize(18);
  doc.text("INVOICE", 15, 50);

  doc.setTextColor(0, 0, 0);


  doc.setFontSize(12);
  doc.text(`Invoice #: ${safeText(invoice.invoiceNumber)}`, 15, 60);
  doc.text(`Date: ${safeText(formatDate(invoice.paymentDate))}`, 140, 60);

  doc.setFontSize(14);
  doc.text("Bill To:", 15, 70);
  doc.setFontSize(12);
  doc.text(`Name: ${safeText(invoice.payerName)}`, 15, 80);
  doc.text(`Email: ${safeText(invoice.email)}`, 15, 85);


  doc.setFillColor(230, 230, 230);
  doc.rect(15, 95, 180, 10, "F");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Plan", 20, 102);
  doc.text("Amount", 100, 102);
  doc.text("Status", 160, 102);

  doc.text(safeText(invoice.plan), 20, 112);
  doc.text(`$${safeText(invoice.amountPaid)}`, 100, 112);
  doc.text(safeText(invoice.status), 160, 112);

  doc.setFontSize(14);
  doc.setTextColor(140, 113, 255);
  doc.text("Total Amount:", 120, 130);
  doc.setFontSize(12);
  doc.text(`$${safeText(invoice.amountPaid)}`, 170, 130);

  doc.line(15, 150, 195, 150);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Thank you for your business!", 80, 160);
  doc.text("For support, contact: info@quasiai.com", 60, 165);

  doc.save(`${invoice.invoiceNumber}.pdf`);
};

  
  onMounted(fetchInvoices);
  </script>
  
  
  <style scoped>
  /* White Background, No Shadows */
  .white-bg {
    background: #ffffff !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  /* Scrollable Table */
  .table-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
  }
  
  /* Plan Colors */
  .text-premium {
    color: #8C71FF;
    font-weight: bold;
  }
  .text-free {
    color: #6c757d;
    font-weight: bold;
  }
  
  /* Status Colors */
  .text-success {
    color: green;
    font-weight: bold;
  }
  .text-error {
    color: red;
    font-weight: bold;
  }
  </style>
  