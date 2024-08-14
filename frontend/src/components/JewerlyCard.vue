<template>
  <div class="jewelry-card">
    <div class="image-container">
      <img :src="jewelry.image" :alt="jewelry.name" class="jewelry-image">
    </div>
    <div class="jewelry-info">
      <h2 class="jewelry-name">{{ jewelry.name }}</h2>
      <ul>
        <li><span>Precio:</span> {{ jewelry.price }} $</li>
        <li><span>Stock:</span> {{ jewelry.stock }}</li>
        <li><span>Categoría:</span> {{ jewelry.category }}</li>
      </ul>
      <button @click="deleteJewelry" class="delete-button" v-if="user && user.role === 'admin'">
        Eliminar joya
      </button>
      <button @click="toggleSellDialog" class="sell-button" v-if="user && user.role === 'admin'">
        Vender joya
      </button>
    </div>

    <div v-if="showSellDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>Vender Joya</h3>
        <label for="quantity">Cantidad:</label>
        <input type="number" v-model="quantity" min="1" :max="jewelry.stock" class="quantity-input">
        <div class="dialog-actions">
          <button @click="sellJewelry" class="confirm-sell-button">Confirmar</button>
          <button @click="toggleSellDialog" class="cancel-sell-button">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment';
import { defineProps, ref } from 'vue';
import apiService from '../../services/api.service';

const user = JSON.parse(localStorage.getItem('user'));
const props = defineProps({
  jewelry: Object
});

const showSellDialog = ref(false);
const quantity = ref(1);

const toggleSellDialog = () => {
  showSellDialog.value = !showSellDialog.value;
};

const deleteJewelry = async () => {
  try {
    const response = await apiService.delete(`/jewelry/${props.jewelry._id}`);
    console.log('Joya eliminada:', response.data);
    window.location.reload();
  } catch (error) {
    console.error('Error al eliminar la joya:', error);
  }
};

const sellJewelry = async () => {
  try {
    const sellData = {
      jewerly: props.jewelry._id,
      sellDate: moment().format('YYYY-MM-DD'),
      price: props.jewelry.price,
      quantity: quantity.value
    }
    const response = await apiService.post(`/selljewerly`, sellData);
    console.log('Joya vendida:', response.data);
    window.location.reload();
  } catch (error) {
    console.error('Error al vender la joya:', error);
  }
};
</script>

<style scoped>
.jewelry-card {
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
}

.image-container {
  width: 100%;
  height: 0;
  padding-top: 80%;
  position: relative;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}

.jewelry-image {
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
}

.jewelry-info {
  margin-top: 20px;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 0 0 10px 10px;
}

.jewelry-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.jewelry-info li {
  margin-bottom: 10px;
}

.jewelry-info li span {
  font-weight: bold;
  margin-right: 10px;
}

.jewelry-name {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: #000;
}

.delete-button, .sell-button {
  background-color: #FF0000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
}

.delete-button:hover, .sell-button:hover {
  background-color: #CC0000;
}

.sell-button {
  background-color: #3ca50b;
  margin-left: 20px;
}

.sell-button:hover {
  background-color: #2c7a0a;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.dialog h3 {
  margin-top: 0;
}

.quantity-input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.dialog-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.dialog-actions button {
  flex: 1;
  padding: 10px 0;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.confirm-sell-button {
  background-color: #3ca50b;
  color: white;
}

.cancel-sell-button {
  background-color: #FF0000;
  color: white;
}

.confirm-sell-button:hover {
  background-color: #2c7a0a;
}

.cancel-sell-button:hover {
  background-color: #CC0000;
}

@media (max-width: 600px) {
  .jewelry-name {
    font-size: 20px;
  }

  .delete-button, .sell-button, .confirm-sell-button, .cancel-sell-button {
    padding: 10px;
    font-size: 14px;
  }
}
</style>
