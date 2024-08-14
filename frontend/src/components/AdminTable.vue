<template>
  <div>
    <!-- Tabla de Rentas de Vestidos -->
    <h3>Ventas de Renta de Vestidos</h3>
    <table>
      <thead>
        <tr>
          <th>Fecha de Renta</th>
          <th>Vestido</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sell in sells" :key="sell._id">
          <td>{{ new Date(sell.loanDate).toLocaleDateString() }}</td>
          <td>{{ sell.dressName || 'Información no disponible' }}</td>
          <td>{{ sell.price }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"><strong>Total:</strong></td>
          <td>{{ totalSalesAmount }}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Tabla de Ventas de Joyas -->
    <h3>Ventas de Joyas</h3>
    <table>
      <thead>
        <tr>
          <th>Fecha de Venta</th>
          <th>Joya</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Precio Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="jewSell in jewsells" :key="jewSell._id">
          <td>{{ new Date(jewSell.sellDate).toLocaleDateString() }}</td>
          <td>{{ jewSell.jewelryName || 'Información no disponible' }}</td>
          <td>{{ jewSell.quantity }}</td>
          <td>{{ jewSell.price }}</td>
          <td>{{ jewSell.price * jewSell.quantity }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4"><strong>Total:</strong></td>
          <td>{{ totalJewelrySalesAmount }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { onMounted, watch } from 'vue';

export default {
  props: {
    sells: Array,
    jewsells: Array,
    totalSalesAmount: Number,
    totalJewelrySalesAmount: Number
  },
  setup(props) {
    const fetchData = async () => {
      console.log('AdminTable component mounted or props changed');

      try {
        // Process dress rentals
        for (const sell of props.sells) {
          if (sell.dress && sell.dress._id) {
            const dressId = sell.dress._id;
            console.log('Fetching dress with ID:', dressId);
            
            const response = await fetch(`http://localhost:3000/api/dresses/${dressId}`);
            if (response.ok) {
              const data = await response.json();
              console.log('Full dress response data:', data.dress);  // Log the full response
              sell.dressName = data.dress.name || 'No name found';  // Assign name or fallback
            } else {
              console.error(`Failed to fetch dress with ID ${dressId}: ${response.statusText}`);
              sell.dressName = 'Información no disponible';
            }
          } else {
            console.warn(`El vestido en la venta con ID ${sell._id} es nulo o no tiene un _id`);
            sell.dressName = 'Información no disponible';
          }
        }

        // Process jewelry sales
        for (const jewSell of props.jewsells) {
          if (jewSell.jewerly) {
            const jewelryId = jewSell.jewerly;
            console.log('Fetching jewelry with ID:', jewelryId);

            const response = await fetch(`http://localhost:3000/api/jewerly/${jewelryId}`);
            if (response.ok) {
              const data = await response.json();
              console.log('Full jewelry response data:', data);  // Log the full response
              jewSell.jewelryName = data.name || 'No name found';  // Assign name or fallback
            } else {
              console.error(`Failed to fetch jewelry with ID ${jewelryId}: ${response.statusText}`);
              jewSell.jewelryName = 'Información no disponible';
            }
          } else {
            console.warn(`La joya en la venta con ID ${jewSell._id} es nula o no tiene un _id`);
            jewSell.jewelryName = 'Información no disponible';
          }
        }
      } catch (error) {
        console.error('Error during fetch operations:', error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    watch(() => [props.sells, props.jewsells], () => {
      fetchData();
    });

    return {};
  }
};
</script>


<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  text-align: left;
}

tfoot {
  background-color: #f0f0f0;
  font-weight: bold;
}
</style>
