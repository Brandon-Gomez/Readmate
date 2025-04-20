<template>
  <div class="home container d-flex flex-column align-items-center justify-content-center text-center">
    <h1 class="text-center mb-4"> Bienvenido a la Red Social de Libros</h1>
    <div class="d-flex justify-content-around" v-if="!isAuth">
      <router-link to="/login" class="btn btn-primary">Iniciar Sesión</router-link>
      <router-link to="/register" class="btn btn-secondary">Regístrate</router-link>
    </div>
    <div class="posts-container mt-4 d-flex flex-wrap justify-content-center gap-3">
      <div v-for="post in posts" :key="post.id">
        <div v-if="post.image" class="post-card mb-4 shadow-sm">
          <!-- <h3 class="post-title">{{ post.title }}</h3> -->
          <div class="d-flex align-items-start">
            <img v-if="post.image" :src="post.image" alt="Post Image" class="post-image me-3" />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import apiClient from '@/services/ApiService';

export default {
  data() {
    return {
      isAuth: true,
      posts: [],
    }
  },
  methods: {
    async getAllPosts() {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          this.isAuth = false
          return
        }
        const response = await apiClient.get(`/posts`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.posts = response.data;
      } catch (error) {
        console.error('Error getting posts:', error);
      }
    },
  },
  mounted() {
    this.getAllPosts();
  }
};
</script>

<style scoped>
.home {
  min-height: calc(100vh - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(248, 249, 250, 0.9);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.home h1 {
  color: #343a40;
  font-weight: 300;
  text-align: center;
}

.home i {
  color: #1abc9c;
}

.posts-container {
  margin-top: 20px;
}

.post-card {
  display: flex;
  padding: 15px;
  border-radius: 10px;
  background-color: #fff;
  transition: box-shadow 0.3s, transform 0.3s;
  border: 1px solid #ddd;
  align-items: center;
}

.post-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.post-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  object-position: center;
  display: block;
  margin: auto 0;
}

.post-content {
  flex: 1;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.post-title {
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: #333;
}

@media (max-width: 576px) {
  .home h1 {
    font-size: 1.5rem;
  }

  .home i {
    font-size: 3rem;
  }
}
</style>
