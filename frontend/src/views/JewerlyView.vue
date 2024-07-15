<template>
    <BaseLayout>
      <main>
        <h1 class="text-center text-2xl md:text-4xl font-bold my-4">Catálogo de Joyería</h1>
  
        <!-- Filter section -->
        <div class="flex flex-col sm:flex-row flex-wrap justify-center mb-4 space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
          <!-- Search input -->
          <input type="search" v-model="searchQuery" placeholder="Buscar joyería"
                 class="px-4 py-2 text-gray-700 w-full sm:w-auto">
                 <li class="opcion-nav" >
            <router-link to="/" class="nav-link">
              <i class="fas fa-envelope"></i> Vestidos
            </router-link>
          </li>
          <!-- Category select -->
          <select v-model="selectedCategory" class="px-4 py-2 text-gray-700 w-full sm:w-auto">
            <option value="">Todas las categorías</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">{{ category }}</option>
          </select>
  
          <!-- Price range inputs -->
          <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <input type="number" v-model.number="minPrice" placeholder="Precio mínimo" min="0"
                   class="px-4 py-2 text-gray-700 w-full sm:w-auto">
            <input type="number" v-model.number="maxPrice" placeholder="Precio máximo" min="0"
                   class="px-4 py-2 text-gray-700 w-full sm:w-auto">
          </div>
    
        </div>
  
        <!-- Display jewelries -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          <JewelryCard v-for="jewelry in filteredJewelries" :key="jewelry._id" :jewelry="jewelry" class="mx-2" />
        </div>
      </main>
    </BaseLayout>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import BaseLayout from '../layout/BaseLayout.vue';
  import JewelryCard from '@/components/JewerlyCard.vue';
  import apiService from '../../services/api.service';
  import { url } from '../../services/api.config'; // Use `url` directly from config
  
  const jewelries = ref([]);
  const searchQuery = ref('');
  const selectedCategory = ref('');
  const minPrice = ref(null);
  const maxPrice = ref(null);
  
  onMounted(async () => {
    try {
      const data = await apiService.get('/jewerly');
      jewelries.value = data.map(jewelry => ({
        ...jewelry,
        // Adjust the image URL as per your API response
        image: `${url}/uploads/${jewelry.image}`
      }));
    } catch (error) {
      console.error('Error fetching jewelries:', error);
    }
  });
  
  const filteredJewelries = computed(() => {
    const minPriceValue = minPrice.value !== null && minPrice.value !== '' ? Number(minPrice.value) : null;
    const maxPriceValue = maxPrice.value !== null && maxPrice.value !== '' ? Number(maxPrice.value) : null;
  
    return jewelries.value.filter(jewelry => {
      const matchesSearch = jewelry.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesCategory = selectedCategory.value ? jewelry.category === selectedCategory.value : true;
      const matchesMinPrice = minPriceValue !== null ? jewelry.price >= minPriceValue : true;
      const matchesMaxPrice = maxPriceValue !== null ? jewelry.price <= maxPriceValue : true;
      const matchesStock = jewelry.stock > 0; 

  
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock;
    });
  });
  
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
  
  .available {
    text-decoration: underline;
    color: #34C759;
  }
  
  .not-available {
    text-decoration: underline;
    color: #FF3737;
  }
  </style>
  