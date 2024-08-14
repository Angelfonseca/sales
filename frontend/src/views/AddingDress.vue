<template>
  <BaseLayout>
      <main class="main-container">
          <h1 class="title">Añadir Nuevo Producto</h1>
          <form @submit.prevent="submitProduct" class="product-form" enctype="multipart/form-data">
              <div class="form-group">
                  <label for="type">Tipo de Producto:</label>
                  <select id="type" v-model="selectedType" required>
                      <option value="dress">Vestido</option>
                      <option value="jewelry">Joyería</option>
                  </select>
              </div>
              <div v-if="selectedType === 'dress'">
                  <div class="form-group">
                      <label for="name">Nombre:</label>
                      <input type="text" id="name" v-model="product.name" required />
                  </div>
                  <div class="form-group">
                      <label for="description">Descripción:</label>
                      <textarea id="description" v-model="product.description" required></textarea>
                  </div>
                  <div class="form-group">
                      <label for="size">Talla:</label>
                      <select id="size" v-model="product.size" required>
                          <option v-for="size in dressSizes" :key="size" :value="size">{{ size }}</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label for="color">Color:</label>
                      <input type="text" id="color" v-model="product.color" required />
                  </div>
                  <div class="form-group">
                      <label for="price">Precio:</label>
                      <input type="number" id="price" v-model="product.price" required />
                  </div>
                  <div class="form-group">
                      <label for="picture">Imagen:</label>
                      <input type="file" id="picture" @change="onFileChange" accept="image/*" required />
                      <div class="image-preview" v-if="product.picture">
                          <img :src="imageUrl" alt="Imagen del producto" />
                      </div>
                  </div>
                  <div class="form-group">
                      <label for="forSelling">Para:</label>
                      <select id="forSelling" v-model="product.forSelling" required>
                          <option value= true >Venta</option>
                          <option value= false >Renta</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label for="category">Categoría:</label>
                      <select id="category" v-model="product.category" required>
                          <option value="Fiesta">Fiesta</option>
                      </select>
                  </div>
              </div>
              <div v-if="selectedType === 'jewelry'">
                  <div class="form-group">
                      <label for="name">Nombre:</label>
                      <input type="text" id="name" v-model="product.name" required />
                  </div>
                  <div class="form-group">
                      <label for="description">Descripción:</label>
                      <textarea id="description" v-model="product.description" required></textarea>
                  </div>
                  <div class="form-group">
                      <label for="price">Precio:</label>
                      <input type="number" id="price" v-model="product.price" required />
                  </div>
                  <div class="form-group">
                      <label for="stock">Stock:</label>
                      <input type="number" id="stock" v-model="product.stock" required />
                  </div>
                  <div class="form-group">
                      <label for="image">Imagen:</label>
                      <input type="file" id="image" @change="onFileChange" accept="image/*" required />
                      <div class="image-preview" v-if="product.picture">
                          <img :src="imageUrl" alt="Imagen del producto" />
                      </div>
                  </div>
                  <div class="form-group">
                      <label for="category">Categoría:</label>
                      <select id="category" v-model="product.category" required>
                          <option value="Collares">Collar</option>
                          <option value="Aretes">Arete</option>
                          <option value="Anillos">Anillo</option>
                          <option value="Brazaletes">Brazalete</option>
                          <option value="Dijes">Dije</option>
                          
                      </select>
                  </div>
              </div>
              <button type="submit" class="submit-button">Añadir Producto</button>
          </form>
      </main>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '../layout/BaseLayout.vue';
import apiService from '../../services/api.service';
import { ref } from 'vue';
const token = localStorage.getItem('token');

const product = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  image: '',
  picture: '',
  category: 'Necklaces' // Categoría por defecto para joyería
};

const selectedType = ref('dress'); // Tipo seleccionado por defecto

const dressSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const imageUrl = ref('');

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
      try {
          if (selectedType.value === 'dress') {
              product.picture = file;  // Set picture for dress
          } else {
              product.image = file;    // Set image for jewelry
          }
          imageUrl.value = URL.createObjectURL(file);
      } catch (error) {
          console.error('Error creating image URL:', error);
          alert('Error al cargar la imagen. Por favor, inténtalo de nuevo.');
          event.target.value = '';
      }
  } else {
      alert('Por favor, sube un archivo de imagen válido.');
      event.target.value = '';
  }
};


const submitProduct = async () => {
  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price);
  
  if (selectedType.value === 'dress') {
      formData.append('size', product.size);
      formData.append('color', product.color.trim()); // Elimina espacios en el campo de color
      formData.append('picture', product.picture);
      formData.append('category', product.category);
      formData.append('forSelling', product.forSelling);
  } else if (selectedType.value === 'jewelry') {
      formData.append('stock', product.stock);
      formData.append('image', product.image);
      formData.append('category', product.category);
  }

  try {
      console.log()
      const endpoint = selectedType.value === 'dress' ? '/dresses/create' : '/jewerly';
      console.log('data:', formData);
      const { data } = await apiService.post(endpoint, formData, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      alert('Producto añadido con éxito');
      console.log('Response data:', data);
      resetForm();
  } catch (error) {
      console.error('Error en la solicitud:', error);
  }
};

const resetForm = () => {
  product.value.name = '';
  product.value.description = '';
  product.value.price = 0;
  product.value.stock = 0;
  product.value.picture = ''; // Reset 'picture' for dresses
  product.value.image = '';   // Reset 'image' for jewelry
  product.value.category = 'Necklaces'; // Default category for jewelry
  imageUrl.value = '';
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
}

.product-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #666;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1.2rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #aaa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.image-preview {
  width: 70%;
  height: 450px;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.submit-button {
  padding: 15px 30px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 20px;
}

.submit-button:hover {
  background-color: #0056b3;
}

@media only screen and (max-width: 480px) {
  .main-container {
      padding: 20px;
  }

  .product-form {
      max-width: 300px;
  }

  .form-group {
      margin-bottom: 15px;
  }

  .image-preview {
      width: 50%;
      height: 300px;
  }

  .submit-button {
      padding: 10px 20px;
      font-size: 1.2rem;
  }
}

@media only screen and (max-width: 768px) {
  .main-container {
      padding: 30px;
  }

  .product-form {
      max-width: 400px;
  }

  .form-group {
      margin-bottom: 20px;
  }

  .image-preview {
      width: 60%;
      height: 350px;
  }

  .submit-button {
      padding: 12px 25px;
      font-size: 1.3rem;
  }
}

@media only screen and (max-width: 1024px) {
  .main-container {
      padding: 40px;
  }

  .product-form {
      max-width: 500px;
  }

  .form-group {
      margin-bottom: 25px;
  }

  .image-preview {
      width: 70%;
      height: 400px;
  }

  .submit-button {
      padding: 15px 30px;
      font-size: 1.5rem;
  }
}
</style>
