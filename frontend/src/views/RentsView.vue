<template>
  <BaseLayout>
    <main class="container mx-auto">
      <div class="flex justify-center items-center mb-6">
        <div class="p-input-icon-left w-full max-w-md">
          <i class="pi pi-search" />
          <input v-model="searchKeyword" placeholder="Buscar por usuario, vestido, destinatario"
            class="p-inputtext w-full" />
        </div>
      </div>
      <div class="flex justify-center items-center mb-6">
        <input type="date" v-model="startDate" class="date-input" />
        <input type="date" v-model="endDate" class="date-input" />
        <button @click="filterLoansByDate" class="filter-button">Filtrar</button>
      </div>
      <div class="border-t border-gray-200"></div>
      <table class="p-datatable border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-3">Usuario</th>
            <th class="p-3">Vestido</th>
            <th class="p-3">Numero destinatario</th>
            <th class="p-3">Direccion destinatario</th>
            <th class="p-3">Destinatario</th>
            <th class="p-3">Fecha de renta</th>
            <th class="p-3">Fecha de devolución</th>
            <th class="p-3">Estado</th>
            <th class="p-3">Recibido por</th>
            <th class="p-3">Recibir Vestido</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loan in filteredLoans" :key="loan._id" class="border-t border-gray-200">
            <td class="p-3">{{ loan.userData?.user?.name || 'N/A' }}</td>
            <td class="p-3">{{ loan.dressData?.data?.name || 'N/A' }}</td>
            <td class="p-3">{{ loan.phone || 'N/A' }}</td>
            <td class="p-3">{{ loan.address || 'N/A' }}</td>
            <td class="p-3">{{ loan.recipient || 'N/A' }}</td>
            <td class="p-3">{{ formatDate(loan.loanDate) }}</td>
            <td class="p-3">{{ formatDate(loan.returnDate) }}</td>
            <td class="p-3">{{ loan.returned ? 'Devuelto' : 'No devuelto' }}</td>
            <td class="p-3">{{ loan.receivedForData?.user?.name || 'N/A' }}</td>
            <td class="p-3">
              <button @click="updateReceivedFor(loan._id)"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs">Recibir
                vestido</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="showSuccessMessage"
        class="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
        <strong class="font-bold">Vestido recibido con éxito!</strong>
        <span class="block sm:inline">El vestido ha sido recibido correctamente.</span>
      </div>

      <div v-if="showErrorMessage" class="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded relative mt-4"
        role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>
    </main>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseLayout from '../layout/BaseLayout.vue';

const user = JSON.parse(localStorage.getItem('user'));
const loans = ref([]);
const searchKeyword = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const errorMessage = ref('');
const startDate = ref('');
const endDate = ref('');

const fetchLoans = async (init, end) => {
  try {
    const response = await fetch('http://localhost:3000/api/sells/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ init, end })
    });
    const data = await response.json();
    if (data && data.data && Array.isArray(data.data)) {
      loans.value = await Promise.all(data.data.map(async loan => {
        loan.userData = await fetchUser(loan.user);
        loan.dressData = await fetchDress(loan.dress);
        loan.receivedForData = await fetchReceivedFor(loan.receivedfor);
        return loan;
      }));
    } else {
      console.error('API response is not an array');
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  const now = new Date();
  const twoMonthsAgo = new Date(now.setMonth(now.getMonth() - 2));
  startDate.value = twoMonthsAgo.toISOString().split('T')[0];
  endDate.value = new Date().toISOString().split('T')[0];
  await fetchLoans(startDate.value, endDate.value);
});

const filterLoansByDate = async () => {
  await fetchLoans(startDate.value, endDate.value);
};

async function fetchUser(id) {
  if (!id || id === 'N/A') {
    return { user: { name: 'N/A' } };
  }
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchDress(id) {
  if (!id || id === 'N/A') {
    return { data: { name: 'N/A' } };
  }
  try {
    const response = await fetch(`http://localhost:3000/api/dresses/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchReceivedFor(id) {
  if (!id || id === 'N/A') {
    return { user: { name: 'N/A' } };
  }
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

const filteredLoans = computed(() => {
  const keyword = searchKeyword.value.toLowerCase().trim();
  const numKeyword = parseInt(keyword, 10);
  const filteredLoans = loans.value.filter(item =>
    (item.userData?.user?.name?.toLowerCase().includes(keyword) || false) ||
    (item.dressData?.data?.name?.toLowerCase().includes(keyword) || false) ||
    (!isNaN(numKeyword) && item.phone === numKeyword) ||
    (item.recipient?.toLowerCase().includes(keyword) || false)
  );
  return filteredLoans.sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate));
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

async function updateReceivedFor(id) {
  try {
    const loan = loans.value.find(loan => loan._id === id);
    if (loan.returned) {
      showErrorMessage.value = true;
      errorMessage.value = 'Este préstamo ya ha sido devuelto.';
      setTimeout(() => {
        showErrorMessage.value = false;
      }, 2000);
      return;
    }

    const response = await fetch(`http://localhost:3000/api/sells/return/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error desconocido');
    }
    const data = await response.json();
    showSuccessMessage.value = true;
    setTimeout(() => {
      showSuccessMessage.value = false;
      window.location.reload();
    }, 2000);
  } catch (error) {
    showSuccessMessage.value = false;
    showErrorMessage.value = true;
    errorMessage.value = error.message;
    setTimeout(() => {
      showErrorMessage.value = false;
    }, 2000);
    console.error(error);
  }
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

.bg-green-100 {
  background-color: #d2f5e3;
}

.border-green-500 {
  border-color: #34c759;
}

.text-green-700 {
  color: #2f855a;
}

.bg-red-100 {
  background-color: #fdecea;
}

.border-red-500 {
  border-color: #f87171;
}

.text-red-700 {
  color: #b91c1c;
}

/* Estilos para las fechas */
.date-input {
  width: 150px;
  height: 30px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-left: 20px;
}

.date-input:focus {
  border-color: #aaa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

}

/* Estilos para el botón */
.filter-button {
  background-color: #4CAF50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 20px;
}

.filter-button:hover {
  background-color: #3e8e41;
}

.filter-button:active {
  background-color: #3e8e41;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
