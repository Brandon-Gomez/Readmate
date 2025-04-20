<template>
    <div>
      <h1>Buscar Usuarios</h1>
      <search-component />
    </div>
  </template>
  
  <script>
  // Importa el componente de búsqueda
  import SearchComponent from '@/components/search_component.vue';
  
  export default {
    components: {
      SearchComponent
    }
  };
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  div {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>