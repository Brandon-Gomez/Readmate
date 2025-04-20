<template>
    <button @click="viewPdf" class="btn btn-primary">
      📄 Ver PDF
    </button>
  </template>
  
  <script>
  export default {
    props: {
      pdfUrl: {
        type: String,
        required: true
      }
    },
    methods: {
      viewPdf() {
        this.$router.push({ 
          name: "PdfPreview", 
          query: { pdfUrl: this.pdfUrl } 
        });
      }
    }
  };
  </script>

<style scoped>
button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
