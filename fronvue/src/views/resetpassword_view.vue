<template>
    <div class="reset-password-view">
      <ResetPassword />
    </div>
  </template>
  
  <script>
  import ResetPassword from "../components/resetpassword_component.vue";
  
  export default {
    components: {
      ResetPassword,
    },
  };
  </script>
  
  <style scoped>
  .reset-password-view {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  </style>
  