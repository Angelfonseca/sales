<template>
    <BaseLayout>
        <main class="main-container">
            <h1 class="title">Añadir Nuevo Vestido</h1>
            <form @submit.prevent="submitDress" class="dress-form" enctype="multipart/form-data">
                <div class="form-group"> <label for="name">Nombre:</label> <input type="text" id="name"
                        v-model="dress.name" required /> </div>
                <div class="form-group"> <label for="description">Descripción:</label> <textarea id="description"
                        v-model="dress.description" required></textarea> </div>
                <div class="form-group"> <label for="size">Talla:</label> <select id="size" v-model="dress.size"
                        required>
                        <option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
                    </select> </div>
                <div class="form-group"> <label for="color">Color:</label> <input type="text" id="color"
                        v-model="dress.color" required /> </div>
                <div class="form-group"> <label for="price">Precio:</label> <input type="number" id="price"
                        v-model="dress.price" required /> </div>
                <div class="form-group"> <label for="picture">Imagen:</label> <input type="file" id="picture"
                        @change="onFileChange" accept="image/*" required /> </div>
                <div class="form-group"> <label for="category">Categoría:</label> <select id="category"
                        v-model="dress.category" required>
                        <option value="Fiesta">Fiesta</option>
                    </select> </div>
                <button type="submit" class="submit-button">Añadir Vestido</button>
            </form>
        </main>
    </BaseLayout>
</template>
<script setup>
import BaseLayout from '../layout/BaseLayout.vue';
 </script>
<script>export default {
    data() {
        return {
            dress: {
                name: '',
                description: '',
                size: '',
                color: '',
                price: 0,
                picture: null,
                category: 'Fiesta',
                available: true,

            },
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        };
    }, methods: {
        onFileChange(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                this.dress.picture = file;
            } else {
                alert('Por favor, sube un archivo de imagen válido.');
                event.target.value = '';
            }
        },
        async submitDress() {
  const formData = new FormData();
  formData.append('name', this.dress.name);
  formData.append('description', this.dress.description);
  formData.append('size', this.dress.size);
  formData.append('color', this.dress.color);
  formData.append('price', this.dress.price);
  formData.append('picture', this.dress.picture);
  formData.append('category', this.dress.category);
  formData.append('available', this.dress.available)

  try {
    const response = await fetch('http://localhost:3000/api/dresses/create', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      alert('Vestido añadido con éxito');
      console.log('Response data:', data); 
      this.resetForm();
    } 
  } catch (error) {
    console.error('Error en la solicitud fetch:', error);
  }
},
resetForm() {
  this.dress = {
    name: '',
    description: '',
    size: '',
    color: '',
    price: 0,
    picture: null,
    category: 'Fiesta',
    available: true,
  };
  this.$refs.pictureInput.value = '';
},
}
}

</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.title {
  font-size: 2rem;
  margin-bottom: 20px;
}

.dress-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
}

.submit-button:hover {
  background-color: #0056b3;
}

.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>