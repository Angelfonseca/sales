<template>
  <BaseLayout>
    <h1 class="title">Nueva renta</h1>
    <main class="main-container">
      <form @submit.prevent="submitForm" class="form">
        <div class="form-group">
          <label for="dress">Selecciona un vestido:</label>
          <input type="text" id="dress" v-model="form.dress" @input="fetchSuggestions"
            placeholder="Escribe para buscar un vestido..." required />
          <ul v-if="suggestions.length">
            <li v-for="suggestion in suggestions" :key="suggestion._id" @click="selectSuggestion(suggestion)">
              {{ suggestion.name }}
            </li>
          </ul>
        </div>
        <div class="form-group">
          <label for="loanDate">Fecha de préstamo:</label>
          <input type="date" id="loanDate" v-model="form.loanDate" required />
        </div>
        <div class="form-group">
          <label for="returnDate">Fecha de devolución:</label>
          <input type="date" id="returnDate" v-model="form.returnDate" required />
        </div>
        <div class="form-group">
          <label for="recipient">Destinatario:</label>
          <input type="text" id="recipient" v-model="form.recipient" required />
        </div>
        <div class="form-group">
          <label for="phone">Teléfono:</label>
          <input type="text" id="phone" v-model="form.phone" required />
          <div v-if="form.phone && !isPhoneValid" class="error-message">
            Teléfono debe tener 10 dígitos
          </div>
        </div>
        <div class="form-group">
          <label for="address">Dirección:</label>
          <input type="text" id="address" v-model="form.address" required />
        </div>
        <button type="submit" class="submit-button">Rentar vestido</button>
      </form>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </main>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseLayout from '../layout/BaseLayout.vue';
import apiService from '../../services/api.service'; // Asegúrate de importar tu servicio API
import moment from 'moment';

const user = JSON.parse(localStorage.getItem('user'));
const availableDresses = ref([]);
const suggestions = ref([]);
const blacklist = ref([]);
const form = ref({
  dress: '',
  loanDate: moment().format('YYYY-MM-DD'), // Set current date
  returnDate: moment().format('YYYY-MM-DD'), // Set current date
  recipient: '',
  phone: '',
  address: '',
});
const successMessage = ref('');
const errorMessage = ref('');

const fetchDresses = async () => {
  try {
    const response = await apiService.get('/dresses');
    availableDresses.value = response.data.filter(dress => dress.available); // Filtrar solo los vestidos disponibles
  } catch (error) {
    console.error('Error fetching dresses:', error);
    errorMessage.value = 'Error al cargar los vestidos';
  }
};
const fetchBlacklist = async () => {
  try {
    const response = await apiService.get('/blacklist');
    blacklist.value = response;
    console.log('Blacklist:', blacklist.value);
  } catch (error) {
    console.error('Error fetching blacklist:', error);
    errorMessage.value = 'Error al cargar la lista negra';
  }
};
const fetchSuggestions = () => {
  const search = form.value.dress.toLowerCase();
  if (search) {
    suggestions.value = availableDresses.value.filter(dress =>
      dress.name.toLowerCase().includes(search)
    );
  } else {
    suggestions.value = [];
  }
};

const selectSuggestion = (suggestion) => {
  form.value.dress = suggestion.name;
  form.value.selectedDressId = suggestion._id;
  suggestions.value = [];
};
const isRecipientBlacklisted = computed(() => {
  const blacklistArray = blacklist.value.map(item => ({ ...item })); // Desestructurar cada elemento
  console.log('Blacklist:', blacklistArray);
  return blacklistArray.some(buyer => buyer.name.toLowerCase() === form.value.recipient.toLowerCase());
});


const isPhoneValid = computed(() => {
  return /^[0-9]{10}$/.test(form.value.phone);
});

const submitForm = async () => {
  console.log('Submitting form...');
  console.log('Recipient:', form.value.recipient);
  console.log('Blacklist:', blacklist.value);
  
  if (!isPhoneValid.value) {
    errorMessage.value = 'Teléfono debe tener 10 dígitos';
    successMessage.value = '';
    return;
  }
  
  if (isRecipientBlacklisted.value) {
    errorMessage.value = 'El destinatario está en la lista negra';
    successMessage.value = '';
    return;
  }

  try {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const dressPrice = availableDresses.value.find(dress => dress._id === form.value.selectedDressId).price;
    const data = {
      user: currentUser._id,
      dress: form.value.selectedDressId,
      recipient: form.value.recipient,
      loanDate: form.value.loanDate,
      returnDate: form.value.returnDate,
      phone: form.value.phone,
      address: form.value.address,
      price: dressPrice,
    }
    const response = await apiService.post('/sells', data);

    console.log('Form submitted successfully:', response.data);

    // Cambiar disponibilidad del vestido
    await apiService.put(`/dresses/availability/${form.value.dress}`, {
      available: false, // Cambiar a false porque el vestido se ha rentado
    }, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });

    successMessage.value = '¡Vestido rentado exitosamente!';
    errorMessage.value = '';
    form.value.dress = '';
    form.value.loanDate = moment().format('YYYY-MM-DD');
    form.value.returnDate = moment().format('YYYY-MM-DD');
    form.value.recipient = '';
    form.value.phone = '';
    form.value.address = '';

  } catch (error) {
    console.error('Error submitting form:', error);
    errorMessage.value = error.response.data.message || 'Error al enviar el formulario';
    successMessage.value = '';
  }
};

onMounted(() => {
  fetchDresses();
  fetchBlacklist();
});

</script>

<style scoped>
.main-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: white;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
}

li {
  padding: 10px;
  cursor: pointer;
}

li:hover {
  background-color: #f0f0f0;
}

.submit-button {
  background-color: #4CAF50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #3e8e41;
}

.success-message {
  margin-top: 20px;
  background-color: #4CAF50;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.error-message {
  margin-top: 20px;
  background-color: #FF5722;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}
</style>
