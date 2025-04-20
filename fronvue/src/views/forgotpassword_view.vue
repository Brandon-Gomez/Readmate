<template>
    <div class="forgot-password-view">
      <ForgotPassword />
    </div>
  </template>
  
  <script>
  import ForgotPassword from "../components/forgotpassword_component.vue";
  
  export default {
    components: {
      ForgotPassword,
    },
  };
  </script>
  
  <style scoped>
  .forgot-password-view {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  </style>
  