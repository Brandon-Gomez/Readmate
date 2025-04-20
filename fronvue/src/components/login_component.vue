<template>
  <div class="login fadeInDown">
    <div id="formContent">
      <div class="fadeIn first">
        <img src="@/assets/LogoRM.png" id="icon" alt="logo" />
      </div>
      <form @submit.prevent="loginUser">
        <input type="email" id="email" class="fadeIn second" placeholder="Correo Electrónico" v-model="email" required>
        <input type="password" id="password" class="fadeIn third" placeholder="Contraseña" v-model="password" required>
        <!-- <input type="text" class="fadeIn second" placeholder="Codigo" v-model="codigo"> -->
        <input type="submit" class="fadeIn fourth" value="Iniciar Sesión">
      </form>
      <div id="formFooter">
        <router-link class="underlineHover" to="/forgot-password">¿Olvidaste tu contraseña?</router-link>
        <router-link class="underlineHover" to="/register">¿No tienes cuenta? Registrate</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../services/ApiService';
export default {
  data() {
    return {
      email: 'salinasgomez16@gmail.com',
      password: 'BrandonGomez12345***',
      // codigo: '',
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await apiClient.post('/login', {
          email: this.email,
          password: this.password,
          // codigo: this.codigo
        });
        // Almacenar el token o redirigir al usuario

        const username = response.data.username;
        const is_admin = response.data.is_admin;

        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('isAdmin', is_admin);
        if (is_admin) {
          this.$router.push(`/admin/dashboard`).then(() => {
            window.location.reload();
          });
        } else {
          this.$router.push(`/profile/${username}`).then(() => {
            window.location.reload();
          });
        }

      } catch (error) {
        console.error('Error en el login:', error.response.data);
      }
    }
  },
  components: {

  }
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  overflow-y: auto;
}

.login {
  padding: 20px;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#formContent {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: #fff;
  padding: 20px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  text-align: center;
}

#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}

/* TABS */

h2.inactive {
  color: #cccccc;
}

h2.active {
  color: #0d0d0d;
  border-bottom: 2px solid #5fbae9;
}

/* FORM TYPOGRAPHY*/

input[type=button],
input[type=submit],
input[type=reset] {
  background-color: #56baed;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 5px 20px 40px 20px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type=button]:hover,
input[type=submit]:hover,
input[type=reset]:hover {
  background-color: #39ace7;
}

input[type=button]:active,
input[type=submit]:active,
input[type=reset]:active {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type=email],
input[type=text],
input[type=password] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

input[type=email]:focus,
input[type=text]:focus,
input[type=password]:focus {
  background-color: #fff;
  border-bottom: 2px solid #5fbae9;
}

input::placeholder {
  color: #cccccc;
}

/* ANIMATIONS */

/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  opacity: 0;
  -webkit-animation: fadeIn ease-in 1;
  -moz-animation: fadeIn ease-in 1;
  animation: fadeIn ease-in 1;

  -webkit-animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  animation-fill-mode: forwards;

  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  animation-duration: 1s;
}

.fadeIn.first {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}

/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  background-color: #56baed;
  content: "";
  transition: width 0.2s;
}

.underlineHover:hover {
  color: #0d0d0d;
}

.underlineHover:hover:after {
  width: 100%;
}

/* OTHERS */

*:focus {
  outline: none;
}

#icon {
  width: 60%;
}

/* Media Queries for Responsive Design */
@media (max-width: 768px) {

  input[type=button],
  input[type=submit],
  input[type=reset] {
    padding: 10px 50px;
    font-size: 12px;
  }

  input[type=email],
  input[type=text],
  input[type=password] {
    font-size: 14px;
    padding: 10px 20px;
  }

  #formContent {
    padding: 20px;
    margin: 0 10px;
  }
}

@media (max-width: 480px) {

  input[type=button],
  input[type=submit],
  input[type=reset] {
    padding: 10px 30px;
    font-size: 11px;
  }

  input[type=email],
  input[type=text],
  input[type=password] {
    font-size: 12px;
    padding: 10px 15px;
    width: 100%;
  }

  #formContent {
    width: 95%;
    margin: 0;
  }
}
</style>
