<template>
  <div v-if="profileData" class="profile-container container my-4 py-4">
    <div class="profile-header row align-items-center">
      <div class="col-md-3 text-center">
        <img :src="getProfileImage()" class="profile-image img-fluid rounded-circle border" alt="Profile Picture" />
      </div>
      <div class="col-md-9 profile-info">
        <h1 class="h3">{{ profileData.name }}</h1>
        <button @click="toggleFollow" :class="['btn', 'btn-primary', { following: follows.isFollowing }]"
          v-if="!isCurrentUser">
          <div>{{ follows.isFollowing ? "Dejar de seguir" : "Seguir" }}</div>
        </button>
        <p class="text-muted"><strong>{{ profileData.username || 'No disponible' }}</strong></p>
        <div class="profile-stats d-flex justify-content-around my-3">
          <div>{{ publications }} Publicaciones</div>
          <div>{{ follows.followers }} seguidores</div>
          <div>{{ follows.following }} seguidos</div>
        </div>
        <p v-if="profileData.description" v-html="formattedDescription(profileData.description)"></p>
        <router-link v-if="isCurrentUser" :to="`/profile/${profileData.username}/edit-account`"
          class="btn btn-primary btn-block">
          Editar perfil
        </router-link>
      </div>
    </div>

    <div v-if="isCurrentUser"
      class="add-post-button my-4 text-center d-flex justify-content-center align-items-baseline">
      <button @click="addNewPost" class="btn btn-success rounded-circle">
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <div class="posts-container mt-4">
      <div v-for="post in filteredPosts(profileData.username)" :key="post.id" class="post-card mb-4 shadow-sm">
        <div class="d-flex align-items-start">
          <img v-if="post.image" :src="post.image" alt="Post Image" class="post-image me-3" />

          <div class="post-content flex-grow-1">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-description">{{ post.description }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <PdfPreviewComponent v-if="post.pdf_file" :pdfUrl="post.pdf_file" />
              <LikeComponent :postId="String(post.id)" />
            </div>
          </div>

          <div class="dropdown ms-auto" v-if="isCurrentUser">
            <button class="btn btn-link text-secondary p-0" type="button" id="dropdownMenuButton"
              data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
              <li v-if="isCurrentUser">
                <router-link :to="`/posts/${post.id}/edit-post`" class="dropdown-item">✏️ Editar</router-link>
              </li>
              <li v-if="isCurrentUser">
                <button @click="deletePost(post.id)" class="dropdown-item">🗑️ Eliminar</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import FollowComponent from '@/components/follow_component.vue';
import apiClient from '@/services/ApiService';
import LikeComponent from '@/components/like_component.vue';
import PdfPreviewComponent from '@/components/pdfpreview_component.vue'

export default {
  components: {
    LikeComponent,
    PdfPreviewComponent,
    // FollowComponent,
  },
  data() {
    return {
      profileData: {
        name: '',
        birthdate: '',
        gender: '',
        description: '',
        profile_picture: ''
      },
      isCurrentUser: null,
      posts: [],
      publications: 0,
      follows: {
        isFollowing: false,
        followers: 0,
        following: 0,
      }

    };
  },
  computed: {
    formattedBirthdate() {
      if (this.profileData.birthdate) {
        const date = new Date(this.profileData.birthdate);
        return date.toLocaleDateString();
      }
      return '';
    },
  },
  watch: {
    '$route'() {
      this.getProfile();
      this.fetchDataFollows();
      // this.getAllPosts();
    }
  },
  methods: {
    formattedDescription(description) {
      return description ? description.replace(/\n/g, '<br>') : '';
    },
    async getProfile() {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await apiClient.get(`/profile/${this.$route.params.username}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.profileData = response.data.user;
          this.isCurrentUser = response.data.isCurrentUser;

          // console.log('User ID:', this.profileData.id);

          if (this.isCurrentUser) localStorage.setItem('profileData', JSON.stringify(this.profileData));

          this.getPostCount(this.profileData.id);
          this.getAllPosts(this.profileData.id);
          this.fetchDataFollows();
          //console.log(this.follows)

        } catch (error) {
          console.error("Error fetching profile:", error);
          // redirect to login if token is invalid
        }
      }
      // else {
      //   this.$router.push('/login');
      // }
    },
    getProfileImage() {
      const defaultImageUrl = "https://firebasestorage.googleapis.com/v0/b/booksharing-socialnetwork.appspot.com/o/profile%2Fdefault.jpg?alt=media"; // Reemplaza con la URL de tu imagen predeterminada en Firebase
      return this.profileData.profile_picture
        ? this.profileData.profile_picture
        : defaultImageUrl;
    },
    async getAllPosts(userId) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await apiClient.get(`/posts/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.posts = response.data;
      } catch (error) {
        console.error('Error getting posts:', error);
      }
    },
    async getPostCount(userId) {
      const token = localStorage.getItem('authToken');
      try {
        const response = await apiClient.get(`/posts/count/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.publications = response.data.post_count; // Asignamos el conteo de publicaciones
      } catch (error) {
        console.error("Error getting post count:", error);
      }
    },
    // filteredPosts(username) {
    //   return this.posts.filter(post => post.username === username);
    // },
    filteredPosts() {
      return this.posts;
    },

    addNewPost() {
      this.$router.push('/posts');
    },
    editPost(postId) {
      this.$router.push(`/posts/${postId}/edit-post`);
    },
    async deletePost(postId) {
      const token = localStorage.getItem('authToken');
      if (confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
        try {
          await apiClient.delete(`/posts/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.posts = this.posts.filter(post => post.id !== postId); // Actualiza la lista de publicaciones
          this.$router.push(`/profile/${this.profileData.username}`).then(() => {
            window.location.reload();
          });
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      }
    },

    //////////////////////////
    /////  FOLLOWS  /////////
    /////////////////////////

    async fetchDataFollows() {
      try {
        await this.fetchFollowerCount();
        await this.fetchFollowingCount();
        await this.checkIfFollowing();
        //console.log("Datos actualizados para userId:", this.profileData.id);
      } catch (error) {
        console.error("Error al actualizar datos:", error);
      }
    },
    async fetchFollowerCount() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token de autenticación no encontrado");
        return;
      }
      try {
        //console.log(this.profileData)
        const response = await apiClient.get(`/follow/followers/count/${this.profileData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.follows.followers = response.data.followerCount;
      } catch (error) {
        console.error("Error al obtener la cantidad de seguidores:", error);
      }
    },
    async fetchFollowingCount() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token de autenticación no encontrado");
        return;
      }
      try {
        const response = await apiClient.get(`/follow/following/count/${this.profileData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.follows.following = response.data.followingCount;
      } catch (error) {
        console.error("Error al obtener la cantidad de seguidos:", error);
      }
    },
    async toggleFollow() {
      //console.log("toggleFollow ejecutado");
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token de autenticación no encontrado");
        return;
      }

      if (!this.profileData.id) {
        console.error("ID de usuario no definido");
        return;
      }

      try {
        if (this.follows.isFollowing) {
          await apiClient.delete(`/follow/${this.profileData.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { followed_id: this.profileData.id },
          });
          this.follows.followers--;
          this.follows.isFollowing = false;
        } else {
          const payload = { followed_id: this.profileData.id };
          await apiClient.post(
            `/follow`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          this.follows.followers++;
          this.follows.isFollowing = true;
        }
        // this.$emit("update-followers", this.follows.followers);
      } catch (error) {
        console.error("Error al cambiar el estado de seguimiento:", error);
        if (error.response && error.response.data) {
          console.error("Detalles del error:", error.response.data);
        }
      }
    },
    async checkIfFollowing() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token de autenticación no encontrado");
        return;
      }

      try {
        const response = await apiClient.get(`/follow/check/${this.profileData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.follows.isFollowing = response.data.isFollowing;
      } catch (error) {
        console.error("Error al verificar el estado de seguimiento:", error);
      }
    },
  },
  mounted() {
    this.getProfile();
    // this.getAllPosts();
  }
};
</script>

<style scoped>
p {
  white-space: pre-wrap;
  /* Respeta saltos de línea y espacios */
  line-height: 1.5;
  /* Ajusta la altura entre líneas */
}

.profile-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  overflow: hidden;
}

.profile-info h1 {
  font-size: 1.75rem;
}

.profile-stats {
  font-size: 1rem;
}

.add-post-button .btn {
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  /* Añadir un borde */
  align-items: center;
}

.post-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
  /* Efecto de elevación */
}

.post-image {
  width: 300px;
  height: 300px;
  object-fit: contain;
  object-position: center;
  /* Centra la imagen dentro del contenedor */
  display: block;
  /* Asegura que la imagen se comporta correctamente en su contenedor */
  margin: auto 0;
  /* Centra la imagen horizontalmente */
}

.post-content {
  flex: 1;
  /* Hace que el contenido ocupe el espacio restante */
  margin-left: 15px;
  /* Espaciado entre la imagen y el contenido */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.post-title {
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: #333;
  /* Color del título */
}

.post-description {
  margin: 0.5rem 0;
  color: #666;
  /* Color más suave para la descripción */
}

.btn-primary,
.btn-success {
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
  /* Cambiar el color en hover */
}

.btn-success:hover {
  background-color: #45a049;
  /* Cambiar el color en hover */
}

.dropdown .btn-link {
  font-size: 1.5rem;
  /* Tamaño de los tres puntos */
}

.dropdown .dropdown-menu {
  min-width: 100px;
  text-align: left;
}

.dropdown .dropdown-item {
  font-size: 1rem;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
}


@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-image {
    margin-bottom: 20px;
  }

  .profile-info {
    text-align: center;
  }

  .profile-stats {
    flex-direction: column;
    gap: 10px;
  }

  .post-card {
    flex-direction: column;
    /* Cambiar a columna en dispositivos más pequeños */
    align-items: center;
  }

  .post-image {
    margin-bottom: 10px;
    /* Espaciado entre imagen y contenido */
  }
}
</style>
