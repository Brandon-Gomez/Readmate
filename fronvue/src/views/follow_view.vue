<template>
  <MainLayout>
    <div class="follow-view">
      <follow-component :userId="userId" />
    </div>
  </MainLayout>
</template>

<script>
import FollowComponent from "@/components/follow_component.vue";

export default {
  components: {
    FollowComponent,
  },
  // Vue Router automáticamente inyecta el parámetro 'userId' en el componente
  // sin necesidad de declararlo explícitamente en las props de FollowView
  created() {
    // Verifica si userId está disponible
    console.log("userId recibido en FollowView:", this.$route.params.userId);
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
  },
};
</script>

<style scoped>
.follow-view {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
</style>
