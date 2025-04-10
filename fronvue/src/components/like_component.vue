<template>
    <div class="like-container" v-if="isLiked !== null">  <!-- Esperamos a que isLiked esté definido -->
      <button @click="toggleLike" :class="{ liked: isLiked }">
        <span>{{ isLiked ? '❤️' : '🤍' }}</span>
      </button>
      <span>{{ likeCount }} Me gusta</span>
    </div>
  </template>
  
  <script>
  import apiClient from "@/services/ApiService";
  
  export default {
    props: {
      postId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        isLiked: null, // Cambiar a null para evitar un valor inicial incorrecto
        likeCount: 0,
      };
    },
    async created() {
      try {
        // Obtén el contador de "likes" y verifica si el usuario ya ha dado like
        await this.fetchLikeCount();
        await this.checkIfLiked();
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    },
    methods: {
      // Obtiene el contador de "likes"
      async fetchLikeCount() {
        try {
          const response = await apiClient.get(`/like/count/${this.postId}`);
          this.likeCount = response.data.likeCount;
        } catch (error) {
          console.error("Error fetching like count:", error);
        }
      },
      // Cambia el estado del "like" (activar/desactivar)
      async toggleLike() {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Authentication token not found");
          return;
        }
  
        try {
          if (this.isLiked) {
            // Quitar "like"
            await apiClient.delete(`/like/${this.postId}`, {
              headers: { Authorization: `Bearer ${token}` },
              data: { postId: this.postId },
            });
            this.likeCount--;
            this.isLiked = false;
          } else {
            // Agregar "like"
            await apiClient.post(
              `/like`,
              { postId: this.postId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            this.likeCount++;
            this.isLiked = true;
          }
        } catch (error) {
          console.error("Error toggling like:", error);
        }
      },
      // Verifica si el usuario ya ha dado like
      async checkIfLiked() {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Authentication token not found");
          return;
        }
  
        try {
          const response = await apiClient.get(`/like/check/${this.postId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.isLiked = response.data.isLiked; // Establecemos el valor de isLiked con la respuesta de la API
        } catch (error) {
          console.error("Error checking if liked:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .like-container {
    display: flex;
    align-items: center;
  }
  
  .like-container button.liked {
    color: red; /* Cambia el color del ícono cuando el like está activo */
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5em;
  }
  
  button.liked {
    color: red;
  }
  
  span {
    margin-left: 0.5em;
  }
  </style>
  