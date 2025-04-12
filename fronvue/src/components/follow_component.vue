<template>
  <div class="follow-container" v-if="isFollowing !== null">
    <button @click="toggleFollow" :class="{ following: isFollowing }">
      <span>{{ isFollowing ? "Siguiendo" : "Seguir" }}</span>
    </button>
    <span>{{ followerCount }} seguidores</span>
    <span>{{ followingCount }} seguidos</span>
  </div>
</template>

<script>
import apiClient from "@/services/ApiService";

export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isFollowing: null,
      followerCount: 0,
      followingCount: 0,
    };
  },
  watch: {
    userId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchData();
        }
      },
    },
  },
  methods: {
    async fetchData() {
      try {
        await this.fetchFollowerCount();
        await this.fetchFollowingCount();
        await this.checkIfFollowing();
        //console.log("Datos actualizados para userId:", this.userId);
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
        const response = await apiClient.get(`/follow/followers/count/${this.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.followerCount = response.data.followerCount;
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
        const response = await apiClient.get(`/follow/following/count/${this.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.followingCount = response.data.followingCount;
      } catch (error) {
        console.error("Error al obtener la cantidad de seguidos:", error);
      }
    },
    async toggleFollow() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token de autenticación no encontrado");
        return;
      }

      if (!this.userId) {
        console.error("ID de usuario no definido");
        return;
      }

      try {
        if (this.isFollowing) {
          await apiClient.delete(`/follow/${this.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { followed_id: this.userId },
          });
          this.followerCount--;
          this.isFollowing = false;
        } else {
          const payload = { followed_id: this.userId };
          await apiClient.post(
            `/follow`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          this.followerCount++;
          this.isFollowing = true;
        }
        this.$emit("update-followers", this.followerCount);
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
        const response = await apiClient.get(`/follow/check/${this.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.isFollowing = response.data.isFollowing;
      } catch (error) {
        console.error("Error al verificar el estado de seguimiento:", error);
      }
    },
  },
};
</script>

<style scoped>
.follow-container {
  display: flex;
  align-items: center;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1em;
  color: #007bff;
  transition: color 0.3s, background-color 0.3s;
  /* Animación suave */
}

button.following {
  color: white;
  background-color: green;
  /* Botón con fondo verde */
  padding: 5px 10px;
  border-radius: 5px;
}

span {
  margin-left: 0.5em;
}
</style>
