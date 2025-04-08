<template>
  <div class="container post-container my-4">
    <div class="container py-4">
      <h2 class="mb-4">Nueva Publicación</h2>
      <form @submit.prevent="createPost">
        <div class="mb-3">
          <label for="title" class="form-label">Título:</label>
          <input v-model="newPost.title" type="text" id="title" class="form-control"
            placeholder="Ingrese el título de la publicación" required />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Descripción:</label>
          <textarea v-model="newPost.description" id="description" class="form-control" rows="4"
            placeholder="Escriba la descripción aquí" required></textarea>
        </div>
        <div class="mb-3">
          <label for="photo" class="form-label">Subir Foto:</label>
          <input type="file" id="photo" class="form-control" @change="onFileChange" accept="image/*" />
        </div>
        <div class="mb-4">
          <label for="book" class="form-label">Subir Libro (PDF):</label>
          <input type="file" id="book" class="form-control" @change="onPdfChange" accept="application/pdf" />
        </div>
        <button type="submit" class="btn btn-primary w-100">Publicar</button>
      </form>
    </div>
  </div>
</template>

<script>

import apiClient from '@/services/ApiService';

export default {
  data() {
    return {
      newPost: {
        title: '',
        description: '',
      },
      images: '',
      pdf_file: '',
      profileData: {
        name: '',
        birthdate: '',
        gender: '',
        description: ''
      },
      posts: [],
      newComment: '',
      profilePhoto: [],
    };
  },
  methods: {
    onFileChange(event) {
      this.newPost.images = event.target.files[0]; // Asigna la imagen
    },
    onPdfChange(event) {
      this.newPost.pdf_file = event.target.files[0]; // Asigna el PDF
    },
    async createPost() {
  try {
    const token = localStorage.getItem('authToken');
    
    // Crear FormData y agregar los datos de la publicación
    const formData = new FormData();
    formData.append("title", this.newPost.title);
    formData.append("description", this.newPost.description);
    formData.append("images", this.newPost.images);
    formData.append("pdf", this.newPost.pdf_file);

    // Enviar la solicitud con FormData
    const response = await apiClient.post('/posts', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // Actualizar la lista de publicaciones
    console.log(response.data);
    this.$router.push(`/profile/${this.profileData.username}`).then(() => {
      window.location.reload();
    });
  } catch (error) {
    console.error('Error creating post:', error);
  }
},
  },
  mounted() {
    this.profileData = JSON.parse(localStorage.getItem('profileData'));
  },
};
</script>

<style scoped>

.post {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
}

.post-container {
  background-color: rgba(255, 255, 255, 0.9);
  /* Blanco con 90% de opacidad */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.text-muted {
  font-size: 0.9rem;
  font-style: italic;
}

.img-fluid {
  max-height: 300px;
  /* Limitar la altura de la imagen si es muy grande */
  object-fit: cover;
}

.container {
  max-width: 600px;
}

.form-label {
  font-weight: bold;
}

.btn {
  font-size: 1.1em;
  padding: 10px;
}
</style>