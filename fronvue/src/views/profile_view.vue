<template>
    <div class="profile-view">
      <ProfileComponent />
    </div>
  </template>
  
  <script>
  import ProfileComponent from '../components/profile_component.vue';
  
  export default {
    data() {
      return {
        username: this.$route.params.username // Captura el username de la URL
      };
    },
    components: {
      ProfileComponent,
    },
  };
  </script>
  
  <style scoped>
  .profile-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  </style>
  