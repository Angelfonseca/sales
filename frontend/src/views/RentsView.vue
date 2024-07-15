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
          <tr v-for="loan in paginatedLoans" :key="loan._id" class="border-t border-gray-200">
            <td data-label="Usuario" class="p-3">{{ loan.userData?.name || 'N/A' }}</td>
            <td data-label="Vestido" class="p-3">{{ loan.dressData?.name || 'N/A' }}</td>
            <td data-label="Numero destinatario" class="p-3">{{ loan.phone || 'N/A' }}</td>
            <td data-label="Direccion destinatario" class="p-3">{{ loan.address || 'N/A' }}</td>
            <td data-label="Destinatario" class="p-3">{{ loan.recipient || 'N/A' }}</td>
            <td data-label="Fecha de renta" class="p-3">{{ formatDate(loan.loanDate) }}</td>
            <td data-label="Fecha de devolución" class="p-3">{{ formatDate(loan.returnDate) }}</td>
            <td data-label="Estado" class="p-3">{{ loan.returned ? 'Devuelto' : 'No devuelto' }}</td>
            <td data-label="Recibido por" class="p-3">{{ loan.receivedForData?.name || 'N/A' }}</td>
            <td data-label="Recibir Vestido" class="p-3">
              <button @click="handleReturnClick(loan)"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs">Recibir
                vestido</button>
              <div v-if="loan.showLateMessage"
                class="bg-yellow-100 border border-yellow-500 text-yellow-700 px-4 py-3 rounded relative mt-4"
                role="alert">
                <strong class="font-bold">{{ loan.lateMessage }}</strong>
                <span class="block sm:inline">{{ loan.daysLate }} días de retraso.</span>
                <div class="mt-2">
                  <button @click="confirmLateReturn(loan)"
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">Confirmar entrega
                    tardía</button>
                  <button @click="cancelLateReturn(loan)"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-xs">Cancelar</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-container">
        <button @click="prevPage" class="pagination-button">
          <i class="pi pi-chevron-left"></i> Anterior
        </button>
        <button @click="nextPage" class="pagination-button">
          Siguiente <i class="pi pi-chevron-right"></i>
        </button>
        <span class="pagination-text">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
      </div>

      <!-- Success and Error Messages for Desktop -->
      <div v-if="!isMobile && showSuccessMessage"
        class="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
        <strong class="font-bold">Vestido recibido con éxito!</strong>
        <span class="block sm:inline">El vestido ha sido recibido correctamente.</span>
      </div>
      <div v-if="!isMobile && showErrorMessage"
        class="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>
    </main>

    <!-- Success and Error Messages for Mobile -->
    <div v-if="isMobile && showSuccessMessage"
      class="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded relative mt-4 mobile-alert"
      role="alert">
      <strong class="font-bold">Vestido recibido con éxito!</strong>
      <span class="block sm:inline">El vestido ha sido recibido correctamente.</span>
    </div>
    <div v-if="isMobile && showErrorMessage"
      class="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded relative mt-4 mobile-alert" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseLayout from '../layout/BaseLayout.vue';
import apiService from '../../services/api.service';

const user = JSON.parse(localStorage.getItem('user'));
const loans = ref([]);
const searchKeyword = ref('');
const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);
const errorMessage = ref('');
const startDate = ref('');
const endDate = ref('');
const currentPage = ref(1);
const pageSize = ref(4);
const isMobile = ref(false);

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
  const now = new Date();
  const oneMonthAgo = new Date();
  const oneDayAhead = new Date();

  oneMonthAgo.setMonth(now.getMonth() - 1);
  oneDayAhead.setDate(now.getDate() + 2);

  startDate.value = formatDateWithoutTime(oneMonthAgo);
  endDate.value = formatDateWithoutTime(oneDayAhead);

  await fetchLoans(startDate.value, endDate.value);
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);

  // Cleanup listener on unmount
  return () => {
    window.removeEventListener('resize', checkIsMobile);
  };
});

const filterLoansByDate = async () => {
  await fetchLoans(startDate.value, endDate.value);
};

async function fetchLoans(init, end) {
  try {
    const response = await apiService.post('/sells/filter', { init, end });
    const data = response.data;

    if (Array.isArray(data)) {
      loans.value = await Promise.all(data.map(async loan => {
        loan.userData = await fetchUser(loan.user);
        loan.dressData = await fetchDress(loan.dress);
        loan.receivedForData = await fetchReceivedFor(loan.receivedfor);
        loan.showLateMessage = false;
        loan.confirmedLateReturn = false;
        loan.isLate = new Date(loan.returnDate) < new Date();
        loan.lateMessage = `La fecha de devolución es ${formatDate(loan.returnDate)}`;
        loan.daysLate = Math.ceil((new Date() - new Date(loan.returnDate)) / (1000 * 3600 * 24));
        return loan;
      }));
    } else {
      console.error('API response is not an array', data); // Log the actual response data for debugging
      showError('Error: API response is not in the expected format.');
    }
  } catch (error) {
    console.error('Error fetching loans:', error);
    showError('Error al cargar los préstamos.');
  }
}


const handleReturnClick = async (loan) => {
  if (loan.returned) {
    showError('Este vestido ya ha sido devuelto anteriormente.');
    return;
  }

  if (loan.isLate && !loan.confirmedLateReturn) {
    loan.showLateMessage = true;
    return;
  }

  await processReturn(loan);
};

const processReturn = async (loan) => {
  try {
    if (loan.returned) {
      showError('Este vestido ya ha sido devuelto anteriormente.');
      return;
    }

    const response = await apiService.put(`/sells/return/${loan._id}`, {
      username: user.username,
    });
    const data = await response;

    if (response.status < 200 || response.status >= 300) {
      throw new Error(data.message || 'Error al procesar la devolución.');
    }

    // Actualizar el objeto de préstamo localmente
    loan.returned = true; // Suponiendo que tu API actualiza esta propiedad

    showSuccess('Vestido recibido con éxito!');
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Recargar la página después de 1 segundo
  } catch (error) {
    console.error(error);
    showError('Error al procesar la devolución.');
  }
};
const confirmLateReturn = async (loan) => {
  try {
    // Realiza la devolución, incluso si es tardía
    await processReturn(loan);
    loan.showLateMessage = false; // Oculta el mensaje de entrega tardía después de confirmar
    loan.confirmedLateReturn = true; // Marca la entrega tardía como confirmada
  } catch (error) {
    console.error(error);
    showError('Error al confirmar la devolución tardía.');
  }
};

const cancelLateReturn = (loan) => {
  loan.showLateMessage = false; // Oculta el mensaje de entrega tardía sin procesar la devolución
  loan.confirmedLateReturn = false; // Marca la entrega tardía como no confirmada
};

// ...

const showSuccess = (message) => {
  errorMessage.value = ''; // Limpiar mensaje de error
  errorMessage.value = message;
  showErrorMessage.value = false; // Ocultar mensaje de error
  showSuccessMessage.value = true; // Mostrar mensaje de éxito

  // Ocultar mensaje de éxito después de 3 segundos
  setTimeout(() => {
    showSuccessMessage.value = false;
    errorMessage.value = '';
  }, 3000);
};

const showError = (message) => {
  showSuccessMessage.value = false; // Ocultar mensaje de éxito
  errorMessage.value = message;
  showErrorMessage.value = true; // Mostrar mensaje de error

  // Ocultar mensaje de error después de 3 segundos
  setTimeout(() => {
    showErrorMessage.value = false;
    errorMessage.value = '';
  }, 3000);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatDateWithoutTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

async function fetchUser(id) {
  if (!id || id === 'N/A') {
    return { user: { name: 'N/A' } };
  }
  try {
    const response = await apiService.get(`/users/${id}`);
    const data = await response.user;

    return data;
  } catch (error) {
    console.error(error);
    return { user: { name: 'N/A' } };
  }
}

async function fetchDress(id) {
  if (!id || id === 'N/A') {
    return { data: { name: 'Vestido eliminado' } };
  }
  try {
    const response = await apiService.get(`/dresses/${id}`);
    const data = await response.dress;

    return data;
  } catch (error) {
    console.error(error);
    return { data: { name: 'Vestido borrado' } };
  }
}

async function fetchReceivedFor(id) {
  if (!id || id === 'N/A') {
    return { user: { name: 'N/A' } };
  }
  try {
    const response = await apiService.get(`/users/${id}`);
    const data = await response.user;

    return data;
  } catch (error) {
    console.error(error);
    return { user: { name: 'N/A' } };
  }
}

const filteredLoans = computed(() => {
  const keyword = searchKeyword.value.toLowerCase();
  const filtered = loans.value.filter(loan => {
    const userDataName = loan.userData && loan.userData.user ? loan.userData.user.name.toLowerCase() : '';
    const dressDataName = loan.dressData && loan.dressData.data ? loan.dressData.data.name.toLowerCase() : '';

    return userDataName.includes(keyword) ||
           dressDataName.includes(keyword) ||
           loan.recipient.toLowerCase().includes(keyword);
  });



  return filtered;
});


const paginatedLoans = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredLoans.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredLoans.value.length / pageSize.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
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
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  background-color: #007bff; 
  color: #ffffff;
  border: none;
  padding: 5px 10px; 
  font-size: 14px; 
  cursor: pointer;
  border-radius: 5px; 
  margin-left: 20px;
}

.pagination-button:hover {
  background-color: #0069d9; /* darker blue color on hover */
}

.pagination-text {
  font-size: 14px; /* reduced font size to match button font size */
  margin: 0 10px;
}

/* Vertical table layout for mobile devices */
/* Mobile table styles */
@media (max-width: 768px) {

  table {
    display: block;
    width: 100%;
  }

  thead {
    display: none;
  }

  tr {
    display: block;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding: 10px;
    background-color: #f9f9f9;
  }

  th,
  td {
    display: block;
    width: 100%;
    padding: 10px;
    border: none;
  }

  td {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  td::before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 20px;
  }

  tr:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {

  .p-datatable {
    display: block;
    width: 100%;
  }

  .p-datatable thead {
    display: none;
  }

  .p-datatable tr {
    display: block;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding: 10px;
    background-color: #f9f9f9;
  }

  .p-datatable th,
  .p-datatable td {
    display: block;
    width: 100%;
    padding: 10px;
    border: none;
  }

  .p-datatable td {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .p-datatable td::before {
    content: attr(data-label);
    font-weight: bold;
    margin-right: 20px;
  }

  /* Increase search input field size */
  .p-input-icon-left {
    width: 350px;
    /* Increase width to 350px */
    font-size: 2rem;
    /* Increase font size to 1.4rem */
    padding: 10px 30px;
    /* Add some padding for better usability */
  }

  .date-input {
    width: 200px;
  }

  .filter-button {
    padding: 15px 30px;
  }
}
.mobile-alert {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: 90%;
}

</style>
