<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <img class="w-25 h-25 mb-2" src="/login.png" alt="logo">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert" v-if="hasError">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline"> Datos incorrectos por favor revísalos.</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
          <h1 class="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Inicia Sesión
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="login">
            <div>
              <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuario</label>
              <input v-model="form.username" type="text" name="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="user98" required="">
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
              <input v-model="form.password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
            </div>
            <button type="submit" class="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Ingresar</button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Olvidaste tu contraseña? :o <a href="#" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Olvidé mi contraseña</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '../../services/api.service';

const router = useRouter()
const hasError = ref(false)
const form = ref({
  username: '',
  password: ''
})

const login = () => {
  hasError.value = false;
  apiService.post('/users/auth/login', form.value)
    .then(response => {
      if (response.error) {
        hasError.value = true;
      } else {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        const user = JSON.parse(localStorage.getItem('user'));
        switch(user.role) {
          case 'admin':
            router.push('/adding');
            break;
          case 'user':
            router.push('/');
            break;
          default:
            router.push('/');
        }
        console.log(response);
      }
    })
    .catch(err => {
      console.log(err);
      hasError.value = true;
    });
}

const isAuth = window.localStorage.getItem('token');
if (isAuth) {
  router.push('/');
}
</script>

<style scoped>
/* Add any additional styling here */
</style>
