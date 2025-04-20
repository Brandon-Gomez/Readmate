<template>
  <div>
    <!-- Botón para alternar la barra lateral -->
    <button @click="toggleSidebar" class="toggle-button">
      ☰ <!-- Icono de hamburguesa -->
    </button>

    <div class="sidebar" :class="{ open: isSidebarOpen }">
      <div class="profile-section text-center py-4">
        <img
          :src="getProfileImage()"
          class="profile-picture rounded-circle mb-3"
          alt="Profile"
          v-if="profileData.username"
        />
        <h5 class="text-dark">{{ profileData.name }}</h5>
        <p class="text-muted">{{ profileData.username || '' }}</p>
      </div>
      
      <ul class="list-group list-group-flush">
        <li class="list-group-item list-group-item-action" @click="navigateToHome">
          <i class="fa fa-home"></i> Inicio
        </li>
        <li class="list-group-item list-group-item-action" @click="navigateToProfile">
          <i class="fa fa-user"></i> Perfil
        </li>
        <li class="list-group-item list-group-item-action" @click="logout">
          <i class="fa fa-sign-out"></i> Cerrar sesión
        </li>
        <li class="list-group-item list-group-item-action" @click="toggleSearch">
          <i class="fa fa-search"></i> Buscar
        </li>
      </ul>

      <div v-if="isSearchVisible" class="search-bar p-3">
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
            class="list-group-item list-group-item-action" 
            @click="goToProfile(user.username)">
            {{ user.username }} ({{ user.name }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/services/ApiService';

export default {
  data() {
    return {
      profileData: JSON.parse(localStorage.getItem('profileData')) || {
        name: '',
        username: '',
        profile_picture: '',
      },
      isSidebarOpen: false, // Estado de la barra lateral
      isSearchVisible: false,
      searchQuery: '',
      users: [],
    };
  },
  methods: {
    getProfileImage() {
    const defaultImageUrl = "https://firebasestorage.googleapis.com/v0/b/booksharing-socialnetwork.appspot.com/o/profile%2Fdefault.jpg?alt=media"; // Reemplaza con la URL de tu imagen predeterminada en Firebase
    return this.profileData.profile_picture
      ? this.profileData.profile_picture
      : defaultImageUrl;
  },
    navigateToHome() {
      this.$router.push('/');
    },
    navigateToProfile() {
      const isAuthenticated = this.checkAuthentication();
      if (isAuthenticated) {
        this.$router.push(`/profile/${this.profileData.username}`);
      } else {
        alert("Por favor, inicia sesión primero.");
        this.$router.push('/login');
      }
    },
    toggleSearch() {
      this.isSearchVisible = !this.isSearchVisible;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen; // Alternar la visibilidad de la barra lateral
    },
    async searchUser() {
      if (this.searchQuery.length > 2) {
        try {
          const response = await apiClient.get('/search', { params: { query: this.searchQuery } });
          this.users = response.data;
        } catch (error) {
          console.error('Error al buscar usuarios:', error);
        }
      } else {
        this.users = [];
      }
    },
    goToProfile(username) {
      this.$router.push(`/profile/${username}`);
      this.isSearchVisible = false;
    },
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('profileData');
      this.$router.push('/login').then(() => {
        window.location.reload();
      });
    },
    checkAuthentication() {
      return !!localStorage.getItem('authToken');
    }
  }
}
</script>

<style scoped>
/* Sidebar general style */
.sidebar {
  width: 250px;
  background-color: rgba(255, 255, 255, 0.85); /* Blanco con más transparencia */
  backdrop-filter: blur(12px); /* Efecto de difuminado más intenso */
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0;
  z-index: 1000;
  border-radius: 0 10px 10px 0; /* Bordes redondeados */
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2); /* Sombra */
  transition: transform 0.3s ease; /* Transición para abrir y cerrar */
  transform: translateX(-100%); /* Ocultar la barra lateral inicialmente */
}

.sidebar.open {
  transform: translateX(0); /* Mostrar la barra lateral */
}

.toggle-button {
  position: fixed;
  top: 20px;
  left: 20px; /* Ajustar la posición según sea necesario */
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  z-index: 1001; /* Asegúrate de que esté por encima de la barra lateral */
}

/* Profile section */
.profile-section {
  background-color: rgba(255, 255, 255, 0.75); /* Fondo blanco semitransparente más claro */
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.profile-picture {
  width: 80px;
  height: 80px;
  border: 3px solid #1abc9c; /* Borde verde suave */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Sombra para la imagen de perfil */
}

/* List group style */
.list-group-item {
  cursor: pointer;
  padding: 15px 20px;
  transition: background-color 0.3s, color 0.3s;
  border: none;
  background-color: transparent; /* Fondo transparente */
  color: #34495e; /* Color de texto oscuro */
}

.list-group-item:hover {
  background-color: rgba(20, 20, 20, 0.1); /* Sutil efecto de fondo oscuro al hacer hover */
  color: #1abc9c; /* Color del texto verde suave al hacer hover */
}

/* Search bar */
.search-bar {
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.85); /* Fondo de la barra de búsqueda más translúcido */
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px; /* Bordes redondeados */
}

.search-bar input {
  border-radius: 20px; /* Bordes suaves */
}

/* User search results */
.list-group.mt-2 {
  max-height: 150px; /* Mantener los resultados de búsqueda desplazables */
  overflow-y: auto; /* Permitir desplazamiento */
}

/* Transitions and responsiveness */
@media (max-width: 768px) {
  .sidebar {
    width: 220px; /* Ancho ajustado para pantallas más pequeñas */
  }

  .sidebar.open {
    transform: translateX(0); /* Mostrar la barra lateral */
  }

  .toggle-button {
    left: 10px; /* Ajustar la posición del botón en pantallas más pequeñas */
  }
}
</style>
