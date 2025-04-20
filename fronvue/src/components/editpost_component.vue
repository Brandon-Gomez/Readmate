<template>
    <div v-if="newPost" class="edit-post-container container my-4 py-4">
      <h2>Editar Publicación</h2>
      <form @submit.prevent="updatePost">
        <div class="form-group my-2">
          <label for="title">Título</label>
          <input type="text" id="title" v-model="newPost.title" class="form-control" />
        </div>
  
        <div class="form-group my-2">
          <label for="description">Descripción</label>
          <textarea id="description" v-model="newPost.description" class="form-control"></textarea>
        </div>
  
        <div class="form-group my-2">
          <label for="image">Imagen</label>
          <input type="file" id="image" @change="handleImageUpload" class="form-control" accept="image/*"/>
        </div>
  
        <div class="form-group my-2">
          <label for="pdf">Archivo PDF</label>
          <input type="file" id="pdf" @change="handlePdfUpload" class="form-control" accept="application/*"/>
        </div>
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        <button @click="deletePost" class="btn btn-danger ml-2">Eliminar Publicación</button>
      </form>
    </div>
  </template>
  
  <script>
import apiClient from '@/services/ApiService';

export default {
  props: {
    postId: String, 
  },
  data() {
    return {
      newPost: { 
        title: '',
        description: '',
      },
      images: '',
      pdf_file: '',
      profileData: {
      },
    };
  },
  mounted() {
    this.fetchPost();
    this.profileData = JSON.parse(localStorage.getItem('profileData'));
  },
  methods: {
    async fetchPost() {
      try {
        const response = await apiClient.get(`/posts/${this.postId}`);
        this.newPost = response.data;
        // console.log("DATA OBTENIDA:", response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    },
    handleImageUpload(event) {
      this.newPost.images = event.target.files[0];
    },
    handlePdfUpload(event) {
      this.newPost.pdf_file = event.target.files[0];
    },
    async updatePost() {
      const token = localStorage.getItem('authToken');
      if (token) {
        const formData = new FormData();
        
        if (!this.newPost.title || !this.newPost.description) {
          console.error('Title and description are required.');
          return;
    }

    formData.append('title', this.newPost.title);
    formData.append('description', this.newPost.description);
    // formData.append('images', this.newPost.images);
    // formData.append('pdf', this.newPost.pdf_file);

    // Añadir la imagen solo si se seleccionó una nueva
    if (this.newPost.images) {
      formData.append('images', this.newPost.images);
    }

    // Añadir el PDF solo si se seleccionó uno nuevo
    if (this.newPost.pdf_file) {
      formData.append('pdf', this.newPost.pdf_file);
    }

    // Log de datos que se enviarán
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await apiClient.put(`/posts/${this.postId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);

      this.$router.push(`/profile/${this.profileData.username}`)
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }
},
    async deletePost() {
      try {
        await apiClient.delete(`/posts/${this.postId}`);
        this.$router.push(`/profile/${this.$route.params.username}`);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    },
  },
};
</script>

  <style scoped>
  .edit-post-container {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  </style>
  