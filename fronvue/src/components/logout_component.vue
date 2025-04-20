<template>
    <div>
      <button @click="logout">Cerrar sesión</button>
    </div>
  </template>
  
  <script>
  import apiClient from '../services/ApiService';
  
  export default {
    methods: {
      async logout() {
        try {
          // Realizar la solicitud de POST al servidor para cerrar sesión
          await apiClient.post('/logout', {}, {
            withCredentials: true // Incluir credenciales si estás usando cookies
          });
  
          // Limpiar el token del localStorage (si lo guardaste allí)
          localStorage.removeItem('token');
  
          // Redirigir al usuario a la página de login
          this.$router.push('/login');
        } catch (error) {
          console.error('Error al cerrar sesión', error);
        }
      }
    }
  };
  </script>
  