<template>
  <BaseLayout>
    <main>
      <h1 class="text-center text-2xl md:text-4xl font-bold my-4">Catálogo</h1>

      <!-- Filter section -->
      <div
        class="flex flex-col sm:flex-row flex-wrap justify-center mb-4 space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
        <li class="opcion-nav">
          <router-link to="/jewelry" class="nav-link">
            <i class="fas fa-envelope"></i> Joyería
          </router-link>
        </li>
        <input type="search" v-model="searchQuery" placeholder="Buscar vestido"
          class="px-4 py-2 text-gray-700 w-full sm:w-auto">
        <select v-model="selectedForSelling" class="px-4 py-2 text-gray-700 w-full sm:w-auto">
          <option value="">Todos</option>
          <option value="sale">Para Venta</option>
          <option value="rent">Para Renta</option>
        </select>

        <select v-model="selectedSize" class="px-4 py-2 text-gray-700 w-full sm:w-auto">
          <option value="">Todos los tamaños</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>

        <select v-model="selectedColor" class="px-4 py-2 text-gray-700 w-full sm:w-auto">
          <option value="">Todos los colores</option>
          <option v-for="color in uniqueColors" :key="color" :value="color">{{ color }}</option>
        </select>

        <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <input type="number" v-model.number="minPrice" placeholder="Precio mínimo" min="0"
            class="px-4 py-2 text-gray-700 w-full sm:w-auto">
          <input type="number" v-model.number="maxPrice" placeholder="Precio máximo" min="0"
            class="px-4 py-2 text-gray-700 w-full sm:w-auto">
        </div>


        <div class="flex items-center w-full sm:w-auto">
          <input type="checkbox" v-model="onlyAvailable" id="available-checkbox" class="mr-2">
          <label for="available-checkbox" class="text-gray-700">Mostrar solo disponibles</label>
        </div>
      </div>


      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        <DressCard v-for="dress in filteredDresses" :key="dress.id" :dress="dress" class="mx-2" />
      </div>
    </main>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BaseLayout from '../layout/BaseLayout.vue';
import DressCard from '@/components/DressCard.vue';
import apiService from '../../services/api.service';
import { url } from '../../services/api.config'; // Use `url` directly from config

const dresses = ref([]);

const uniqueColors = computed(() => {
  if (!dresses.value) return [];

  const colors = dresses.value.map(dress => dress.color);
  return [...new Set(colors)];
});

const searchQuery = ref('');
const selectedSize = ref('');
const selectedColor = ref('');
const minPrice = ref(null);
const maxPrice = ref(null);
const onlyAvailable = ref(false);
const selectedForSelling = ref('');


onMounted(async () => {
  try {
    const data = await apiService.get('/dresses');
    dresses.value = data.data.map(dress => ({
      ...dress,
      pictureUrl: `${url}/uploads/${dress.picture}` // Use `url` directly without `/api`
    }));
  } catch (error) {
    console.error('Error fetching dresses:', error);
  }
});

const filteredDresses = computed(() => {
  if (!dresses.value) return [];

  const minPriceValue = minPrice.value !== null && minPrice.value !== '' ? Number(minPrice.value) : null;
  const maxPriceValue = maxPrice.value !== null && maxPrice.value !== '' ? Number(maxPrice.value) : null;

  return dresses.value.filter(dress => {
    const matchesSearch = dress.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesSize = selectedSize.value ? dress.size === selectedSize.value : true;
    const matchesColor = selectedColor.value ? dress.color.toLowerCase() === selectedColor.value.toLowerCase() : true;
    const matchesAvailability = onlyAvailable.value ? dress.available : true;
    const matchesMinPrice = minPriceValue !== null ? dress.price >= minPriceValue : true;
    const matchesMaxPrice = maxPriceValue !== null ? dress.price <= maxPriceValue : true;

    // New filter logic for selling or renting
    const isForSale = dress.forSelling === true;
    const isSold = dress.sold === true;
    const matchesForSelling = selectedForSelling.value === ''
      || (selectedForSelling.value === 'sale' && isForSale && !isSold)
      || (selectedForSelling.value === 'rent' && !isForSale);

    return matchesSearch && matchesSize && matchesColor && matchesMinPrice && matchesMaxPrice && matchesAvailability && matchesForSelling;
  });
});

</script>

<style scoped>
.dress-card {
  margin: 20px;
}

/* Estilos personalizados para la página de Main */
.first\:ml-5 {
  margin-left: 5px;
}

@media (min-width: 640px) {
  .first\:ml-5 {
    margin-left: 0;
  }
}

.opcion-nav {
  display: inline-block;
  margin: 0 10px;
  padding: 10px 15px;
  border-radius: 5px;
  background-color: #f7f7f7;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}
</style>
