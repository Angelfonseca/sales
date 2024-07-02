<template>
  <div class="evento" :key="dress.id">
    <div class="imagen">
      <img :src="dress.image" alt="Imagen del vestido">
    </div>
    <div class="contenido">
      <h3 class="titulo">{{ dress.name }}</h3>
      <p class="descripcion">{{ dress.price }}</p>

    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Definimos las propiedades que espera recibir el componente DressCard
const props = defineProps({
  dress: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.evento {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.imagen img {
  width: 100%;
  height: auto;
}

.contenido {
  padding: 16px;
}

.titulo {
  font-weight: bold;
  font-size: 1.15rem;
  /* Ajusta el tamaño del título según sea necesario */
}
</style>
