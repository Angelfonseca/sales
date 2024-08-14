<template>
    <BaseLayout>
        <main class="admin-view">
            <!-- Sección de Gestión de Usuarios -->
            <section class="section">
                <h2>Gestión de Usuarios</h2>
                <!-- Botones para gestionar usuarios -->
                <div class="buttons">
                    <button class="btn" @click="showAddUserForm">Añadir Usuario</button>
                    <button class="btn" @click="showDeleteUserForm">Eliminar Usuario</button>
                    <button class="btn" @click="showModifyUserForm">Modificar Usuario</button>
                </div>
                <!-- Formulario para añadir usuario -->
                <div v-if="showUserForm" class="form-container">
                    <form @submit.prevent="handleUserFormSubmit">
                        <input type="text" v-model="userFormData.name" placeholder="Nombre" class="input">
                        <input type="text" v-model="userFormData.username" placeholder="Nombre de usuario"
                            class="input">
                        <input type="password" v-model="userFormData.password" placeholder="Contraseña" class="input">
                        <select v-model="userFormData.role" class="input">
                            <option value="admin">Admin</option>
                            <option value="user">Usuario</option>
                        </select>
                        <button type="submit" class="btn submit">Guardar</button>
                    </form>
                </div>

                <!-- Formulario para eliminar usuario -->
                <div v-if="showDeleteForm" class="form-container">
                    <select v-model="selectedUserId" class="input" @change="fetchUserData">
                        <option v-for="user in users" :key="user._id" :value="user._id">{{ user.name }}</option>
                    </select>
                    <button class="btn" @click="handleDeleteUser">Eliminar</button>
                </div>

                <!-- Formulario para modificar usuario -->
                <div v-if="showModifyForm" class="form-container">
                    <select v-model="selectedUserId" class="input" @change="fetchUserData">
                        <option v-for="user in users" :key="user._id" :value="user._id">{{ user.name }}</option>
                    </select>
                    <div v-if="selectedUser">
                        <input type="text" v-model="selectedUser.name" placeholder="Nombre" class="input">
                        <input type="text" v-model="selectedUser.username" placeholder="Nombre de usuario"
                            class="input">
                        <input type="password" v-model="selectedUser.password" placeholder="Contraseña" class="input">
                        <select v-model="selectedUser.role" class="input">
                            <option value="admin">Admin</option>
                            <option value="user">Usuario</option>
                        </select>
                        <button class="btn submit" @click="handleModifyUser">Modificar</button>
                    </div>
                </div>
            </section>

            <!-- Sección de Total de Ventas por Mes -->
            <section class="section">
                <h2>Total de Rentas por Mes</h2>
                <div class="sales-container">
                    <div class="sales-header">
                        <label for="monthYear">Selecciona Mes y Año:</label>
                        <input type="month" id="monthYear" v-model="selectedMonthYear">
                        <button @click="handleSalesFormSubmit" class="btn">Consultar Rentas</button>
                    </div>
                </div>

                <!-- AdminTable component to display sales data -->
                <AdminTable v-if="showAdminTable" :sells="sells" :jewsells="jewsells"
                    :totalSalesAmount="totalSalesAmount" :totalJewelrySalesAmount="totalJewelrySalesAmount" />
            </section>
            <!-- Sección de Lista Negra de Compradores -->
            <section class="section">
                <h2>Lista Negra</h2>
                <!-- Formulario para añadir a la lista negra -->
                <div class="form-container">
                    <form @submit.prevent="addToBlacklist">
                        <input type="text" v-model="blacklistName" placeholder="Nombre" class="input"> <br> <br>
                        <input type="text" v-model="blacklistDescription" placeholder="Descripción" class="input"> <br>
                        <br>
                        <button type="submit" class="btn submit">Añadir a la Lista Negra</button>
                    </form>
                </div>
                <div class="blacklist-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="buyer in blacklist" :key="buyer.name">
                                <td>{{ buyer.name }}</td>
                                <td>{{ buyer.description }}</td>
                                <td>
                                    <button @click="removeFromBlacklist(buyer._id)" class="btn remove">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </BaseLayout>
</template>

<script>
import BaseLayout from '../layout/BaseLayout.vue';
import apiService from '../../services/api.service';
import { api } from '../../services/api.config';
import AdminTable from '../components/AdminTable.vue'

export default {
    components: {
        BaseLayout,
        AdminTable
    },
    data() {
        return {
            showUserForm: false,
            showDeleteForm: false,
            showModifyForm: false,
            showAdminTable: false,
            userFormData: {
                name: '',
                username: '',
                password: '',
                role: 'user'
            },
            users: [],
            selectedUserId: '',
            selectedUser: null,
            selectedMonth: '',
            sells: [],
            blacklistName: '',
            blacklistDescription: '',
            blacklist: [],
            selectedMonthYear: '', // Variable para el mes y año seleccionados
            jewsells: [],
            totalSalesAmount: null,
            totalJewelrySalesAmount: null
        };
    },
    methods: {
        showAddUserForm() {
            this.showUserForm = true;
            this.showDeleteForm = false;
            this.showModifyForm = false;
            this.resetUserForm();
        },
        showDeleteUserForm() {
            this.showDeleteForm = true;
            this.showUserForm = false;
            this.showModifyForm = false;
            this.fetchUsers();
        },
        showModifyUserForm() {
            this.showModifyForm = true;
            this.showUserForm = false;
            this.showDeleteForm = false;
            this.fetchUsers();
        },
        handleUserFormSubmit() {
            apiService.post('/users', this.userFormData)
                .then(response => {
                    alert('Usuario guardado con éxito');
                    this.resetUserForm();
                    this.showUserForm = false;
                })
                .catch(error => {
                    console.error('Error al guardar el usuario:', error);
                });
        },
        fetchUsers() {
            apiService.get('/users')
                .then(response => {
                    this.users = response.users; // Asegurarse de acceder a response.data.users
                })
                .catch(error => {
                    console.error('Error al obtener los usuarios:', error);
                });
        },
        fetchUserData() {
            if (this.selectedUserId) {
                this.selectedUser = this.users.find(user => user._id === this.selectedUserId);
            }
        },
        handleDeleteUser() {
            if (this.selectedUserId) {
                apiService.delete(`/users/${this.selectedUserId}`)
                    .then(() => {
                        alert('Usuario eliminado con éxito');
                        this.selectedUserId = '';
                        this.fetchUsers();
                    })
                    .catch(error => {
                        console.error('Error al eliminar el usuario:', error);
                    });
            }
        },
        handleModifyUser() {
            if (this.selectedUser) {
                apiService.put(`/users/${this.selectedUserId}`, this.selectedUser)
                    .then(() => {
                        alert('Usuario modificado con éxito');
                        this.selectedUserId = '';
                        this.selectedUser = null;
                        this.fetchUsers();
                    })
                    .catch(error => {
                        console.error('Error al modificar el usuario:', error);
                    });
            }
        },
        handleSalesFormSubmit() {
            if (this.selectedMonthYear) {
                const [year, month] = this.selectedMonthYear.split('-');
                const firstDayOfMonth = new Date(`${year}-${month}-02`);

                // Fetch dress rental sales
                apiService.post('/sells/month', { month: firstDayOfMonth.toISOString().split('T')[0] })
                    .then(response => {
                        console.log('Ventas de vestidos:', response.totalSells.sells);  // Log para depuración
                        this.sells = response.totalSells.sells;
                        this.totalSalesAmount = response.totalSells.totalSalesAmount;
                    })
                    .catch(error => {
                        console.error('Error al obtener datos de ventas:', error);
                    });

                // Fetch jewelry sales
                apiService.post('/selljewerly/month', { month: firstDayOfMonth.toISOString().split('T')[0] })
                    .then(response => {
                        console.log('Ventas de joyería:', response.jewsells);  // Accede directamente a las propiedades del objeto
                        this.jewsells = response.jewsells;
                        this.totalJewelrySalesAmount = response.totalSalesAmount;
                    })
                    .catch(error => {
                        console.error('Error al obtener datos de ventas:', error);
                    });


                // Show the AdminTable component
                this.showAdminTable = true;
            }
        }
        ,
        addToBlacklist() {
            if (this.blacklistName && this.blacklistDescription) {
                apiService.post('/blacklist', { name: this.blacklistName, description: this.blacklistDescription })
                    .then(response => {
                        alert('Comprador añadido a la lista negra');
                        this.blacklistName = '';
                        this.blacklistDescription = '';
                        this.fetchBlacklist(); // Actualizar lista negra después de añadir
                    })
                    .catch(error => {
                        console.error('Error al añadir a la lista negra:', error);
                    });
            }
        },
        removeFromBlacklist(id) {
            apiService.delete(`/blacklist/${id}`)
                .then(() => {
                    alert('Comprador eliminado de la lista negra');
                    this.fetchBlacklist();
                })
                .catch(error => {
                    console.error('Error al eliminar de la lista negra:', error);
                });
        },
        resetUserForm() {
            this.userFormData.name = '';
            this.userFormData.username = '';
            this.userFormData.password = '';
            this.userFormData.role = 'user';
        },
        fetchBlacklist() {
            apiService.get('/blacklist')
                .then(response => {
                    this.blacklist = response;
                })
                .catch(error => {
                    console.error('Error al obtener la lista negra:', error);
                });
        }
    },
    mounted() {
        this.fetchBlacklist();
    }
};
</script>

<style scoped>
/* Estilos generales */
.admin-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.section {
    width: 100%;
    max-width: 800px;
    margin-bottom: 40px;
    text-align: center;
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
}

.btn {
    padding: 10px 20px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #0056b3;
}

.btn.submit {
    background-color: #28a745;
}

.btn.submit:hover {
    background-color: #218838;
}

.btn.remove {
    background-color: #dc3545;
}

.btn.remove:hover {
    background-color: #c82333;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.input {
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    width: 100%;
    max-width: 400px;
}

.blacklist-table table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.blacklist-table th,
.blacklist-table td {
    border: 1px solid #dee2e6;
    padding: 10px;
    text-align: left;
}

.blacklist-table th {
    background-color: #f8f9fa;
}

.sales-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.sales-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.sales-result {
    margin-top: 20px;
}
</style>
