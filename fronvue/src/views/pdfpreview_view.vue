<template>
    <div class="pdf-preview-view">
      <button class="close-btn" @click="goBack">Cerrar</button>
      <embed 
        v-if="pdfUrl" 
        :src="pdfUrl" 
        type="application/pdf" 
        width="100%" 
        height="100%" 
      />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        pdfUrl: this.$route.query.pdfUrl || "" // Obtiene la URL del PDF desde los parámetros de la ruta
      };
    },
    methods: {
      goBack() {
        this.$router.go(-1); // Vuelve a la vista anterior
      }
    }
  };
  </script>
  
  <style scoped>
  .pdf-preview-view {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ff4d4d;
    color: #fff;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    z-index: 1010;
  }
  
  .close-btn:hover {
    background-color: #ff0000;
  }
  
  embed {
    width: 80%;
    height: 80%;
    border: 1px solid #ccc;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  </style>
  