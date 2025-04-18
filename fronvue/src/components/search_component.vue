<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchQuery"
      @input="searchUser"
      placeholder="Buscar usuario..."
      class="form-control"
    />
    <ul v-if="users.length" class="list-group mt-2">
      <li 
        v-for="user in users" 
        :key="user.id" 
        class="list-group-item" 
        @click="goToProfile(user.username)">
        {{ user.username }} ({{ user.name }})
      </li>
    </ul>
  </div>
</template>

<script>
import apiClient from '@/services/ApiService'; 

export default {
  data() {
    return {
      searchQuery: '',
      users: [],
    };
  },
  methods: {
    async searchUser() {
      if (this.searchQuery.length > 2) {
        try {
          const response = await apiClient.get('/search', { params: { query: this.searchQuery } });
          console.log('Datos recibidos desde el backend:', response.data);
          this.users = response.data;
        } catch (error) {
          console.error('Error al buscar usuarios:', error);
        }
      } else {
        this.users = [];
      }
    },
    goToProfile(username) {
      this.$router.push(`/profile/${username}`);  // Redirige al perfil del usuario
    },
  },
};
</script>
