<script setup>
import { ref } from 'vue';
import BaseLayout from '../layout/BaseLayout.vue';

const email = ref('contacto@tiendarenta.com');
const phone = ref('(+52) 449 469 7204');

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert(`${text} copiado al portapapeles`);
  });
};
</script>

<template>
  <BaseLayout>
    <main class="container mx-auto py-10 px-4">
      <h1 class="text-4xl font-bold text-center mb-8">Contáctanos</h1>
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <p class="text-lg mb-6 text-justify">
          Si tienes alguna pregunta o necesitas más información sobre nuestros vestidos, no dudes en contactarnos. Estamos aquí para ayudarte a encontrar el vestido perfecto para tu ocasión especial.
        </p>
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-2">Dirección</h2>
          <p>C. Gómez Farias 29-A, Zona Centro, 20670 Pabellón de Arteaga, Ags.</p>
        </div>
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-2">Teléfono</h2>
          <button @click="copyToClipboard(phone)" ref="phoneRef" class="text-blue-500 underline">{{ phone }}</button>
        </div>
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-2">Correo Electrónico</h2>
          <button @click="copyToClipboard(email)" ref="emailRef" class="text-blue-500 underline">{{ email }}</button>
        </div>
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-2">Horario de Atención</h2>
          <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
          <p>Sábados: 10:00 AM - 4:00 PM</p>
          <p>Domingos: Cerrado</p>
        </div>
        <div>
          <h2 class="text-2xl font-semibold mb-2">Ubicación</h2>
          <iframe
            class="w-full h-64"
            src="https://www.google.com.mx/maps/embed?pb=!1m18!1m12!1m3!1d3675.3046012107656!2d-102.278548!3d22.1493919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8429e3e7dc71b3f7%3A0x187323d350b75534!2sCitronella!5e0!3m2!1ses-419!2smx!4v1687371252456!5m2!1ses-419!2smx"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </main>
  </BaseLayout>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

.bg-white {
  background-color: #ffffff;
}

.text-center {
  text-align: center;
}

.font-bold {
  font-weight: bold;
}

.text-lg {
  font-size: 1.125rem;
}

.text-4xl {
  font-size: 2.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-justify {
  text-align: justify;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.p-8 {
  padding: 2rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.h-64 {
  height: 16rem;
}

.w-full {
  width: 100%;
}

.text-blue-500 {
  color: #3b82f6;
}

.underline {
  text-decoration: underline;
}
</style>
