<template>
  <div class="main-layout" :class="{ 'sidebar-open': isSidebarOpen }">
    <NavComponent v-if="isAuthenticated" @search="handleSearch" @sidebar-toggled="toggleSidebar" />
    <div class="layout-container">
      <aside class="sidebar" v-if="isAuthenticated">
        <search-component v-if="showSearch" />
      </aside>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import SearchComponent from '@/components/search_component.vue';
import NavComponent from '@/components/navbar_component.vue';
// Si necesitas decodificar el JWT, puedes usar jwt-decode (opcional)
// import jwt_decode from "jwt-decode";

export default {
  components: {
    SearchComponent,
    NavComponent,
  },
  data() {
    return {
      showSearch: false,
      isAuthenticated: false,
      isSidebarOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    handleSearch() {
      this.showSearch = !this.showSearch;
    },
    checkAuth() {
      // Obtener el token del localStorage
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Validar si el token aún es válido (opcional, puedes decodificarlo)
          // const decoded = jwt_decode(token);
          // // Verifica si el token ha expirado (opcionalmente, usando el campo 'exp' del JWT)
          // const currentTime = Math.floor(Date.now() / 1000);
          // if (decoded.exp < currentTime) {
          //   this.isAuthenticated = false;
          //   localStorage.removeItem('authToken'); // Limpiar token si está expirado
          //   return;
          // }

          // Si el token es válido y no ha expirado, el usuario está autenticado
          this.isAuthenticated = true;
        } catch (error) {
          // Si ocurre algún error al verificar o decodificar el token, el usuario no está autenticado
          this.isAuthenticated = false;
          localStorage.removeItem('authToken'); // Limpiar token inválido
        }
      } else {
        this.isAuthenticated = false;
      }
    }
  },
  mounted() {
    this.checkAuth();
  }
};
</script>

<style scoped>
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
  background-image: url('@/assets/BACK.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.main-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.content {
  flex: 1;
  padding: 0;
  box-sizing: border-box;
  margin-top: 0;
  overflow: hidden;
}
</style>
