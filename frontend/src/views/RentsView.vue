<template>
  <BaseLayout>
    <main class="container mx-auto">
      <div class="flex justify-center items-center mb-6">
        <div class="p-input-icon-left w-full max-w-md">
          <i class="pi pi-search" />
          <input v-model="searchKeyword" placeholder="Buscar por usuario, vestido, folio o destinatario" class="p-inputtext w-full" />
        </div>
      </div>

      <div class="border-t border-gray-200"></div>

      <table class="p-datatable border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-3">Usuario</th>
            <th class="p-3">Vestido</th>
            <th class="p-3">Folio</th>
            <th class="p-3">Destinatario</th>
            <th class="p-3">Fecha de renta</th>
            <th class="p-3">Fecha de devolución</th>
            <th class="p-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loan in filteredLoans" :key="loan.folio" class="border-t border-gray-200">
            <td class="p-3">{{ loan.user }}</td>
            <td class="p-3">{{ loan.dress }}</td>
            <td class="p-3">{{ loan.folio }}</td>
            <td class="p-3">{{ loan.recipient }}</td>
            <td class="p-3">{{ formatDate(loan.loanDate) }}</td>
            <td class="p-3">{{ formatDate(loan.returnDate) }}</td>
            <td class="p-3">{{ getStatus(loan.returnDate) }}</td>
          </tr>
        </tbody>
      </table>
    </main>
  </BaseLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseLayout from '../layout/BaseLayout.vue';

// Sample data
const loans = [
  { user: 'User1', dress: 'Dress1', folio: 123, recipient: 'Jennifer', loanDate: new Date('2023-01-01'), returnDate: new Date('2023-01-15') },
  { user: 'User2', dress: 'Dress2', folio: 124, recipient: 'Angel', loanDate: new Date('2023-02-01'), returnDate: null },
  { user: 'User3', dress: 'Dress3', folio: 125, recipient: 'Tecue', loanDate: new Date('2023-03-01'), returnDate: new Date('2023-03-15') },
  // Add more sample data here if needed
];

// Filters
const searchKeyword = ref('');

// Computed property for filtered loans
const filteredLoans = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim();
  return loans.filter(item =>
    item.user.toLowerCase().includes(keyword) ||
    item.dress.toLowerCase().includes(keyword) ||
    item.folio.toString().includes(keyword) ||
    item.recipient.toLowerCase().includes(keyword)
  );
});

// Format date function
function formatDate(date) {
  return date ? date.toLocaleDateString() : 'N/A';
}

// Get status function
function getStatus(returnDate) {
  return returnDate ? 'Entregado' : 'Pendiente';
}
</script>

<style scoped>
.p-datatable {
  width: 100%;
  margin-top: 2rem;
  text-align: center;
}

.p-input-icon-left {
  position: relative;
}

.p-input-icon-left i {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
}

.p-inputtext {
  padding-left: 2.5rem !important;
}
</style>
