<template>
    <!-- Layout de administración -->
    <AdminLayout />
    <div class="dashboard-view">
        <dashboardComponent />
    </div>
</template>

<script>
import dashboardComponent from '@/components/admin/dashboard_component.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

export default {
    components: {
        AdminLayout,
        dashboardComponent,
    },
};
</script>