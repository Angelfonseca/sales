<template>
  <div class="dress-card">
    <div class="image-container">
      <img :src="dress.pictureUrl" :alt="dress.name" class="dress-image">
    </div>
    <div class="dress-info">
      <h2 class="dress-name">{{ dress.name }}</h2>
      <ul>
        <li><span>Talla:</span> {{ dress.size }}</li>
        <li><span>Color:</span> {{ dress.color }}</li>
        <li><span>Precio:</span> {{ dress.price }} $</li>
        <li>
          <span>Disponibilidad:</span> 
          <span :class="dress.available ? 'available' : 'not-available'">{{ dress.available ? 'Disponible' : 'No disponible' }}</span>
        </li>
        <li v-if="dress.cleaning === true"><span class="dry-cleaning-text">En tintorería</span></li>
        <li v-if="!dress.available && loanDate"><span>Apartado para día:</span> {{ loanDate }}</li>
      </ul>
      <button @click="markAsInDryCleaning" class="dry-cleaning-button"
        v-if="user && (user.role === 'admin' || user.role === 'user')">
        {{ dress.cleaning ? 'Volver a disponibilidad' : 'Marcar en tintorería' }}
      </button> <br>
      <button @click="deleteDress" class="delete-button"
        v-if="user && user.role === 'admin'">Eliminar vestido</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import apiService from '../../services/api.service';

const user = JSON.parse(localStorage.getItem('user'));
const props = defineProps({
  dress: Object
});

const loanDate = ref('');

const getLoanDate = async () => {
  try {
    const response = await apiService.get(`/sells/actual/${props.dress._id}`);
    loanDate.value = new Date(response.sell.returnDate);
    loanDate.value.setDate(loanDate.value.getDate() + 1);
    loanDate.value = loanDate.value.toLocaleDateString();
  } catch (error) {
    console.error('Error al obtener la fecha de préstamo:', error);
  }
};

watch(() => props.dress.available, (newVal) => {
  if (!newVal) {
    getLoanDate();
  }
});

onMounted(() => {
  if (!props.dress.available) {
    getLoanDate();
  }
});

const markAsInDryCleaning = async () => {
  try {
    const response = await apiService.put(`/dresses/${props.dress.name}`, {
      cleaning: !props.dress.cleaning
    });
    console.log('Vestido marcado como en tintorería:', response.data);
    props.dress.cleaning = !props.dress.cleaning;
  } catch (error) {
    console.error('Error al marcar el vestido como en tintorería:', error);
  }
};

const deleteDress = async () => {
  try {
    const response = await apiService.delete(`/dresses/${props.dress.name}`);
    console.log('Vestido eliminado:', response.data);
    // Recarga la página después de eliminar el vestido
    window.location.reload();
  } catch (error) {
    console.error('Error al eliminar el vestido:', error);
  }
};
</script>



<style scoped>
.dress-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  /* Evita desbordamientos visuales */
}

.image-container {
  width: 100%;
  height: 0;
  padding-top: 80%;
  /* Ajusta según la proporción deseada */
  position: relative;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}

.dress-image {
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  /* Cambia 'cover' a 'contain' */
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
}

.dress-info {
  margin-top: 20px;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 0 0 10px 10px;
}

.dress-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dress-info li {
  margin-bottom: 10px;
}

.dress-info li span {
  font-weight: bold;
  margin-right: 10px;
}

.dress-name {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: #000;
}

.delete-button {
  background-color: #FF0000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
}

.delete-button:hover {
  background-color: #CC0000;
}

.text-green-500 {
  color: #34C759;
}

.text-red-500 {
  color: #FF3737;
}

.available {
  text-decoration: underline;
  color: #34C759;
}

.not-available {
  text-decoration: underline;
  color: #FF3737;
}

.dry-cleaning-button {
  background-color: #FFC107;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
}

.dry-cleaning-button:hover {
  background-color: #FFA07A;
}

.dry-cleaning-button.active {
  background-color: #34C759;
  color: white;
}


.text-red-500 {
  color: #FF3737;
}

.dry-cleaning-text {
  font-weight: bold;
  color: #FF3737;
}
</style>