<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg p-4">
          <div class="card-body text-center">
            <h2 class="mb-4">Editar perfil</h2>
            <form @submit.prevent="updateProfile">

              <div class="form-group col-lg-6 col-md-6 col-sm-12 d-flex flex-column mb-4 file-input">
                <input type="file" class="form-control-file" id="imagesInput" name="imagesInput"
                  @change="handleFileUpload">
                <div class="file-input-preview">
                  <div v-if="profilePhoto.length">
                    <div v-for="(file, index) in profilePhoto" :key="index" class="preview-item">
                      <img :src="file.previewURL" alt="Preview" class="preview-image">
                      <span class="preview-filename">{{ file.name }}</span>
                    </div>
                  </div>
                  <div v-else>
                    <div class="placeholder-text">Selecciona una imagen</div>
                  </div>
                </div>
                <label class="btn btn-primary btn-rp fw-bold mt-3 fs-5 text-capitalize file-input-button"
                  for="imagesInput">
                  <span class="bi bi-upload me-2"></span>Cargar Imagen</label>
              </div>

              <div class="form-group mb-3">
                <label for="name">Nombre</label>
                <input type="text" id="name" v-model="profileData.name" class="form-control" />
              </div>
              <div class="form-group mb-3">
                <label for="edad">Edad</label>
                <input type="text" id="name" v-model="profileData.edad" class="form-control" required />
              </div>
              <div class="form-group mb-3">
                <label for="dob">dia</label>
                <label for="dob">Fecha de Nacimiento</label>
                <input type="date" id="dob" v-model="profileData.birthdate" class="form-control" />
              </div>
              <div class="form-group mb-3">
                <label for="gender">Género</label>
                <select id="gender" v-model="profileData.gender" class="form-control">
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div class="form-group mb-4">
                <label for="description">Descripción</label>
                <textarea id="description" v-model="profileData.description" class="form-control" rows="3"></textarea>
              </div>
              <button type="submit" class="btn btn-primary w-100">
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/services/ApiService';

export default {
  data() {
    return {
      profileData: {
        name: '',
        birthdate: '',
        gender: '',
        description: '',
        edad: ''
      },

      form: {
        photo: []
      },
      profilePhoto: [],
    };
  },
  mounted() {
    this.profileData = JSON.parse(localStorage.getItem('profileData'));
    this.profileData.birthdate = this.formatDate(this.profileData.birthdate)
  },
  methods: {
    async updateProfile() {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await apiClient.put(`/profile/${this.profileData.username}/edit-account`, this.profileData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Profile updated successfully:', response.data);
          
          if (this.form.photo.length > 0) {
            const formData = new FormData();
            formData.append('photo', this.form.photo[0]);
            const responsePhoto = await apiClient.post(`/upload/profile`, formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              }
            });
            console.log('Profile photo updated successfully:', responsePhoto.data);
          }
          this.$router.push(`/profile/${this.profileData.username}`).then(() => {
            window.location.reload();
          });

        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }
    },
    formatDate(dateString) {
      if (!dateString) dateString = "2000-01-02"
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
      const day = String(date.getDate()).padStart(2, '0'); // Día en formato 2 dígitos
      return `${year}-${month}-${day}`;
    },
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.form.photo = files; // Almacena las imágenes seleccionadas
      this.profilePhoto = files.map((file) => ({
        name: file.name,
        previewURL: URL.createObjectURL(file),
      }));
    }
  },
};
</script>

<style scoped>
.file-input {
  position: relative;
  width: 100%;
  /* Permitir que el contenedor ocupe el ancho completo */
}

.file-input input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  /* Ocupa todo el ancho del contenedor */
  height: 100%;
  /* Ocupa toda la altura del contenedor */
  opacity: 0;
  /* Ocultar el input */
  cursor: pointer;
  /* Cambiar el cursor al pasar sobre el área de carga */
}

.file-input-preview {
  display: flex;
  flex-wrap: wrap;
  /* Permitir que los elementos se ajusten en múltiples filas */
  gap: 10px;
  /* Espacio entre elementos */
  margin-top: 10px;
  /* Espacio entre el input y la vista previa */
}

.preview-item {
  display: flex;
  align-items: center;
  max-width: 100%;
  /* Asegurar que no se desborde */
  flex: 1 1 calc(33.33% - 10px);
  /* Flexbox para ajustar el tamaño */
  min-width: 80px;
  /* Ancho mínimo para los elementos */
  box-sizing: border-box;
  /* Incluir padding y border en el tamaño total */
}

.preview-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  /* Bordes redondeados para las imágenes */
}

.preview-filename {
  margin-left: 10px;
  overflow: hidden;
  /* Ocultar texto que se desborde */
  text-overflow: ellipsis;
  /* Mostrar puntos suspensivos para el texto largo */
  white-space: nowrap;
  /* Evitar que el texto se divida en varias líneas */
}

.placeholder-text {
  display: block;
  color: #adb5bd;
  text-align: center;
}

/* Responsividad */
@media (max-width: 768px) {
  .preview-item {
    flex: 1 1 calc(50% - 10px);
    /* Dos elementos en pantallas más pequeñas */
  }
}

@media (max-width: 480px) {
  .preview-item {
    flex: 1 1 100%;
    /* Un solo elemento en pantallas muy pequeñas */
  }
}
</style>
