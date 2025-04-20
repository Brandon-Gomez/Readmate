import { createRouter, createWebHistory } from 'vue-router';
import HomeView from "../views/home_view.vue"
import LoginView from '../views/login_view.vue';
import RegisterView from '../views/register_view.vue';
import ForgotPassword from "../views/forgotpassword_view.vue";
import ResetPassword from "../views/resetpassword_view.vue";
import ProfileView from "../views/profile_view.vue"
import EditProfileView from "../views/editprofile_view.vue"
import PostView from "../views/post_view.vue"
import EditPostView from "../views/editpost_view.vue"
//import LikeView from "../views/like_view.vue"
//import PdfPreviewView from "../views/pdfpreview_view.vue"
// import FollowView from "../views/follow_view.vue"
import DashboardView from '../views/admin/dashboard_view.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAdmin: false },

    children: [
      {
        path: '',
        name: 'Home',
        component: HomeView,
      },
      {
        path: '/profile/:username',
        name: 'Profile',
        component: ProfileView,
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: '/profile/:username/edit-account',
        name: 'EditProfile',
        component: EditProfileView,
        props: true,
      },
      {
        path: '/posts',
        name: 'PostView',
        component: PostView,
      },
      {
        path: '/posts/:postId/edit-post',
        name: 'EditPost',
        component: EditPostView,
        props: true,
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de navegación global
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Verifica si hay un token
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Verifica si es admin

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y no está autenticado, redirige al login
    return next({ name: 'Login' });
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    // Si la ruta es solo para administradores y no es admin, redirige al home
    return next({ name: 'Home' });
  }

  if (!to.meta.requiresAdmin && isAdmin) {
    // Si la ruta es solo para usuarios y es admin, redirige al dashboard
    return next({ name: 'Dashboard' });
  }

  next(); // Permite la navegación
});

export default router;