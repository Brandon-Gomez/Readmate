<template>
    <div class="like-view">
      <LikeComponent :postId="postId" />
    </div>
  </template>
  
  <script>
import LikeComponent from "@/components/like_component.vue";
  
  export default {
    components: {
      LikeComponent,
    },
    data() {
      return {
        postId: this.$route.params.postId, // Suponiendo que el postId esté en la URL
      };
    },
  };
  </script>
  
  <style scoped>
  .like-view {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  </style>
  