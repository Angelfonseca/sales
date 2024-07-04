<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900 p-4">
    <div class="flex flex-col items-center" id="navbar">
      <a href="#" class="flex flex-col items-center mb-4" id="logo">
        <span class="text-4xl font-playfair text-white dark:text-white"><em>Citronella</em></span>
        <h3 class="text-lg font-lato text-gray-500 dark:text-gray-400">Viste tu estilo, alquila tu elegancia</h3>
      </a>
      <div class="w-full md:w-auto">
        <ul class="font-medium flex flex-col md:flex-row md:space-x-4">
          <li class="opcion-nav" v-if="route.path !== '/'">
            <router-link to="/" class="nav-link">
              <i class="fas fa-home"></i> Catálogo
            </router-link>
          </li>
          <li class="opcion-nav" v-if="user && (user.role === 'admin' || user.role === 'user') && route.path !== '/rents'">
            <router-link to="/rents" class="nav-link">
              <i class="fas fa-shopping-cart"></i> {{ user.role === 'admin' ? 'Rentas' : 'Rentas' }}
            </router-link>
          </li>
          <li class="opcion-nav" v-if="user && (user.role === 'admin' || user.role === 'user') && route.path !== '/adding'">
            <router-link to="/adding" class="nav-link">
              <i class="fas fa-plus"></i> Agregar vestido
            </router-link>
          </li>
          <li class="opcion-nav" v-if="route.path !== '/about'">
            <router-link to="/about" class="nav-link">
              <i class="fas fa-envelope"></i> Contacto
            </router-link>
          </li>
          <li class="opcion-nav" v-if="user && (user.role === 'admin' || user.role === 'user') && route.path !== '/selling'">
            <router-link to="/selling" class="nav-link">
              <i class="fas fa-envelope"></i> Rentar
            </router-link>
          </li>
          <li class="opcion-nav" v-if="user">
            <a @click="logout" href="#" class="nav-link">
              Cerrar sesión
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const user = ref(null);

if (localStorage.getItem('user')) {
  user.value = JSON.parse(localStorage.getItem('user'));
}

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<style scoped>
#nav-logo {
  width: 40px;
  height: 40px;
}
.opcion-nav {
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: center;
}
#navbar {
  background-color: #313131;
}
.nav-link {
  color: white;
  text-decoration: none;
}
.nav-link:hover {
  color: #1e90ff;
}
</style>
