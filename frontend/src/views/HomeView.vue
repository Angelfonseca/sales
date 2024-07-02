<template>
  <BaseLayout>
    <main>
      <h1 class="text-center text-2xl md:text-4xl font-bold my-4">Catálogo</h1>
      
      <!-- Filter section -->
      <div class="flex flex-col sm:flex-row flex-wrap justify-center mb-4 space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
        <input type="search" v-model="searchQuery" placeholder="Buscar vestido" class="px-4 py-2 text-gray-700 w-full sm:w-auto">
        
        <select v-model="selectedSize" class="px-4 py-2 text-gray-700 w-full sm:w-auto">
          <option value="">Todos los tamaños</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        
        <select v-model="selectedColor" class="px-4 py-2 text-gray-700 w-full sm:w-auto">
          <option value="">Todos los colores</option>
          <option value="blue">Azul</option>
          <option value="red">Rojo</option>
          <option value="black">Negro</option>
          <option value="white">Blanco</option>
        </select>
        
        <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <input type="number" v-model.number="minPrice" placeholder="Precio mínimo" class="px-4 py-2 text-gray-700 w-full sm:w-auto">
          <input type="number" v-model.number="maxPrice" placeholder="Precio máximo" class="px-4 py-2 text-gray-700 w-full sm:w-auto">
        </div>

        <!-- Checkbox for availability -->
        <div class="flex items-center w-full sm:w-auto">
          <input type="checkbox" v-model="onlyAvailable" id="available-checkbox" class="mr-2">
          <label for="available-checkbox" class="text-gray-700">Mostrar solo disponibles</label>
        </div>
      </div>

      <!-- Mostrar los DressCard para cada vestido en la lista dresses -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        <DressCard v-for="dress in filteredDresses" :key="dress.id" :dress="dress" class="first:ml-5" />
      </div>
    </main>
  </BaseLayout>
</template>



<script setup>
import BaseLayout from '../layout/BaseLayout.vue';
import DressCard from '@/components/DressCard.vue'; // Asegúrate de que la ruta sea correcta
import { ref, computed } from 'vue';

// Supongamos que tienes una lista de vestidos
const dresses = [
  { id: 1, name: 'Vestido Azul', size: 'M', color: 'blue', price: 50, available: true, image: '/dress.jpg' },
  { id: 2, name: 'Vestido Rojo', size: 'S', color: 'red', price: 60, available: false, image: '/dress.jpg' },
  { id: 3, name: 'Vestido Negro', size: 'L', color: 'black', price: 70, available: true, image: '/dress.jpg' },
  // Agrega más vestidos según sea necesario
];

const searchQuery = ref('');
const selectedSize = ref('');
const selectedColor = ref('');
const minPrice = ref(null);
const maxPrice = ref(null);
const onlyAvailable = ref(false);

const filteredDresses = computed(() => {
  return dresses.filter(dress => {
    const matchesSearch = dress.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesSize = selectedSize.value ? dress.size === selectedSize.value : true;
    const matchesColor = selectedColor.value ? dress.color === selectedColor.value : true;
    const matchesPrice = (minPrice.value !== null ? dress.price >= minPrice.value : true) &&
                         (maxPrice.value !== null ? dress.price <= maxPrice.value : true);
    const matchesAvailability = onlyAvailable.value ? dress.available : true;

    return matchesSearch && matchesSize && matchesColor && matchesPrice && matchesAvailability;
  });
});
</script>



<style scoped>
/* Estilos personalizados para la página de Main */
</style>