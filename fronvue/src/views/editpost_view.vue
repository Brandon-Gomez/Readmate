<template>
    <div class="edit-post-view">
      <EditPostComponent :postId="$route.params.postId" />
    </div>
  </template>
  
  <script>
  import EditPostComponent from '@/components/editpost_component.vue';
  
  export default {
    components: {
      EditPostComponent,
    },
  };
  </script>
  