<template>
    <div class="admin-layout">
        <div class="layout-container">
            <main class="content">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminLayout',
    beforeCreate() {
        // Simula una función para verificar si el usuario es administrador

    },
    methods: {

    },
};
</script>

<style scoped></style>