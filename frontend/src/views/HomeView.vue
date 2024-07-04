<template>
  <BaseLayout>
    <main>
      <h1 class="text-center text-2xl md:text-4xl font-bold my-4">Catálogo</h1>

      <!-- Filter section -->
      <div
        class="flex flex-col sm:flex-row flex-wrap justify-center mb-4 space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
        <input type="search" v-model="searchQuery" placeholder="Buscar vestido"
          class="px-4 py-2 text-gray-700 w-full sm:w-auto">

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
          <option value="blue">Azul</option>
          <option value="red">Rojo</option>
          <option value="black">Negro</option>
          <option value="white">Blanco</option>
        </select>

        <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <input type="number" v-model.number="minPrice" placeholder="Precio mínimo"
            class="px-4 py-2 text-gray-700 w-full sm:w-auto">
          <input type="number" v-model.number="maxPrice" placeholder="Precio máximo"
            class="px-4 py-2 text-gray-700 w-full sm:w-auto">
        </div>

        <!-- Checkbox for availability -->
        <div class="flex items-center w-full sm:w-auto">
          <input type="checkbox" v-model="onlyAvailable" id="available-checkbox" class="mr-2">
          <label for="available-checkbox" class="text-gray-700">Mostrar solo disponibles</label>
        </div>
      </div>

      <!-- Mostrar los DressCard para cada vestido en la lista dresses -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        <DressCard v-for="dress in filteredDresses" :key="dress.id" :dress="dress" class="mx-2" />
      </div>
    </main>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '../layout/BaseLayout.vue';
import DressCard from '@/components/DressCard.vue';
import { ref, computed, onMounted } from 'vue';

const searchQuery = ref('');
const selectedSize = ref('');
const selectedColor = ref('');
const minPrice = ref(null);
const maxPrice = ref(null);
const onlyAvailable = ref(false);

const dresses = ref([]);

onMounted(() => {
  fetch('http://localhost:3000/api/dresses')
    .then(response => response.json())
    .then(data => {
      // Actualizar las rutas de las imágenes en los datos de los vestidos
      dresses.value = data.data.map(dress => ({
        ...dress,
        pictureUrl: `http://localhost:3000/uploads/${dress.picture}`  // Agregar la URL completa de la imagen
      }));
    })
    .catch(error => console.error('Error fetching dresses:', error));
});

const filteredDresses = computed(() => {
  if (!dresses.value) return [];

  return dresses.value.filter(dress => {
    const matchesSearch = dress.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesSize = selectedSize.value ? dress.size === selectedSize.value : true;
    const matchesColor = selectedColor.value ? dress.color.toLowerCase() === selectedColor.value.toLowerCase() : true;
    const matchesAvailability = onlyAvailable.value ? dress.available : true;

    let matchesPrice = true;
    if (minPrice.value !== null) {
      matchesPrice = dress.price >= minPrice.value;
    }
    if (maxPrice.value !== null) {
      matchesPrice = matchesPrice && dress.price <= maxPrice.value;
    }

    return matchesSearch && matchesSize && matchesColor && matchesPrice && matchesAvailability;
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
</style>
