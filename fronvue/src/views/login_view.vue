<template>
  <div>
    <!-- Layout de administración -->
    <!-- <MainLayout /> -->
    <Login_component />
  </div>
</template>

<script>
import Login_component from '@/components/login_component.vue';
// import MainLayout from '@/layouts/MainLayout.vue';

export default {
  components: {
    Login_component,
    // MainLayout,
  }
};
</script>
