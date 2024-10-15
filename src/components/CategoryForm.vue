<template>
  <div>
    <h2>Create a New Category</h2>
    <div class="mb-3 mt-3">
      <label for="title">Name: </label>
      <input
        type="text"
        id="name"
        v-model="categoryName"
        @keyup.enter="createCat()"
        placeholder="Insert the name"
      />
    </div>
    <div>
      <button @click="createCat()">Create category</button>
      <button class="btn btn-primary mt-2 me-2" @click="goHome()">Go back to the category list</button>
    </div>
  </div>
</template>

<script>
import CategoryRepository from "../repositories/CategoryRepository";

export default {
  data() {
    return {
      categoryName: "",
      categories:[]
    };
  },
  methods: {
    formatCategoryName(string) {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
    async createCat() {
      const trimmedName = this.categoryName.trim();
      if (trimmedName.length > 255) {
        alert("The category name cannot have more then 255 characters.");
        return;
      }
      this.categoryName = this.formatCategoryName(trimmedName);

      if (!this.categoryName.trim()) {
        alert("Please insert a name for the new category.");
        return;
      }
      const categoryExists = this.categories.some(
        (cat) => cat.name.toLowerCase() === this.categoryName.trim().toLowerCase()
      );

      if (categoryExists) {
        alert("This category already exists.");
        return;
      }
      const category = {
        name: this.categoryName.trim()
      };
      try {
        await CategoryRepository.save(category);
        this.$router.push({ name: 'Category' });
      } catch (error) {
        console.error("Error creating category:", error);
      }
    },
    goHome(){
      if(confirm("Are you sure to go back to the category list? All changes will be discarded.")){
        this.$router.push({name:"Category"})
      }
    }
  },
  async mounted(){
    try{
      this.categories= await CategoryRepository.findAll(); 
    }catch(error){
      console.error(error);
    }
  }
};
</script>
<style scoped>
/* Estilo para el contenedor principal */
div {
  max-width: 400px; /* Ancho máximo del contenedor */
  margin: 20px auto; /* Centra el contenedor */
  padding: 20px; /* Espaciado interno */
  background-color: #ffffff; /* Fondo blanco */
  border: 1px solid #ddd; /* Borde gris claro */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

/* Estilo para el encabezado */
h2 {
  color: #333; /* Color de texto oscuro */
  font-size: 24px; /* Tamaño de fuente */
  text-align: center; /* Centra el texto */
  margin-bottom: 20px; /* Espaciado inferior */
}

/* Estilo para las etiquetas de los campos */
label {
  display: block; /* Hace que las etiquetas ocupen todo el ancho */
  margin-bottom: 5px; /* Espaciado inferior */
  font-weight: bold; /* Negrita para las etiquetas */
}

/* Estilo para el campo de entrada */
input[type="text"] {
  width: 100%; /* Ocupa el 100% del ancho disponible */
  padding: 10px; /* Espaciado interno */
  border: 2px solid #007bff; /* Borde azul */
  border-radius: 4px; /* Bordes redondeados */
  margin-bottom: 15px; /* Espaciado inferior */
  font-size: 16px; /* Tamaño de fuente */
  transition: border-color 0.3s; /* Transición suave para el borde */
}

/* Efecto al enfocar el campo de entrada */
input[type="text"]:focus {
  border-color: #0056b3; /* Color de borde más oscuro al enfocar */
  outline: none; /* Sin contorno */
}

/* Estilo para el botón */
button {
  background-color: #007bff; /* Color de fondo azul */
  color: white; /* Color de texto blanco */
  border: none; /* Sin borde */
  border-radius: 4px; /* Bordes redondeados */
  padding: 10px; /* Espaciado interno */
  font-size: 16px; /* Tamaño de fuente */
  cursor: pointer; /* Cambia el cursor a puntero */
  width: 100%; /* Ocupa todo el ancho */
  transition: background-color 0.3s; /* Transición suave */
}

/* Efecto al pasar el ratón sobre el botón */
button:hover {
  background-color: #0056b3; /* Color de fondo más oscuro al pasar el mouse */
}
</style>

