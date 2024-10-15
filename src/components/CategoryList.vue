<template>
  <div class="container">
    <div class="float-end">
      <router-link class="btn btn-primary" :to="'/cat/new'">Create new category</router-link>
    </div>
    <h1> List of categories </h1>
    <div>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
        <div class="col mb-3" v-for="cat in categories" :key="cat.id">
          <CategoryCard
            :cat="cat"
            @selectCat="handleCat"
            @delete-category="deleteCat"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryRepository from "../repositories/CategoryRepository";
import CategoryCard from "./CategoryCard.vue";

export default {
  data() {
    return {
      categories: [],
    };
  },
  components: { CategoryCard },
  methods: {
    async deleteCat(categoryId) {
      if (confirm("¿Are you sure you want to delete this category?")) {
        try {
          await CategoryRepository.delete(categoryId);
          // Filtrar la categoría eliminada
          this.categories = this.categories.filter(cat => cat.id !== categoryId);
        } catch (error) {
          console.error("Error deleting category:", error);
          alert("Error deleting category: " + error.message); // Muestra el error al usuario
        }
      }
    },
    handleCat(categoryName) {
      this.$router.push({ name: 'NoteCat', params: { categoryName: categoryName } });
    }
  },
  async mounted() {
    try {
      this.categories = await CategoryRepository.findAll();
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Error loading categories: " + error.message); // Muestra el error al usuario
    }
  }
}
</script>
<style scoped>
/* Contenedor principal */
.container {
  max-width: 1200px; /* Ancho máximo del contenedor */
  margin: 20px auto; /* Centra el contenedor */
  padding: 15px; /* Espaciado interno */
}

/* Estilo para el encabezado principal */
h1 {
  text-align: center; /* Centra el texto */
  color: #333; /* Color de texto oscuro */
  margin-bottom: 20px; /* Espaciado inferior */
}

/* Estilo para el botón de crear nueva categoría */
.btn-primary {
  margin-bottom: 15px; /* Espaciado inferior */
}

/* Estilo para las columnas de las tarjetas */
.row {
  display: flex; /* Usar flexbox para las columnas */
  flex-wrap: wrap; /* Permite el ajuste en múltiples filas */
}

/* Estilo para cada columna que contiene una tarjeta */
.col {
  padding: 10px; /* Espaciado interno */
}

/* Estilo para las tarjetas (opcional, en el componente CategoryCard) */
.card {
  border: 1px solid #ddd; /* Borde gris claro */
  border-radius: 8px; /* Bordes redondeados */
  background-color: #ffffff; /* Fondo blanco */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

/* Estilo para el texto de las tarjetas */
.card-text {
  margin-bottom: 10px; /* Espaciado inferior */
}

/* Estilo para los botones dentro de las tarjetas */
.card button {
  margin-right: 5px; /* Espaciado a la derecha */
}
</style>
