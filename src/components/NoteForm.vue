<template>
  <div>
    <h1>to do</h1>
    <div class="mb-3 mt-3">
      <label for="title">Título: </label>
      <input
        type="text"
        id="title"
        v-model="noteTitle"
        maxlength="300"
        @keyup.enter="crearNota()"
        placeholder="Insert title (optional)"
      />
    </div>

    <div class="mb-3">
      <label for="content">Contenido: </label>
      <textarea
        id="content"
        v-model="noteContent"
        @keyup.enter="crearNota()"
        placeholder="Insert content (optional)"
      ></textarea>
    </div>

    <div class="mb-3">
      <label for="category">Categorías: </label>
      <multiselect
        v-model="selectedCategories"
        :options="availableCategories"
        :multiple="true"
        label="name"
        track-by="id"
        placeholder="Insert one or more categories if you want"
      ></multiselect>
    </div>

    <div>
      <button @click="crearNota()">Create Note</button>
      <button class="btn btn-primary mt-2 me-2" @click.prevent="goHome">Go back to the list</button>
    </div>
  </div>
</template>

<script>
import CategoryRepository from "../repositories/CategoryRepository";
import NoteRepository from "../repositories/NoteRepository";
import Multiselect from 'vue-multiselect';

export default {
  components: { Multiselect },

  data() {
    return {
      noteTitle: "",
      noteContent: "",
      selectedCategories: [],
      availableCategories: []
    };
  },

  methods: {
    async fetchCategories() {
      try {
        const response = await CategoryRepository.findAll();
        if (Array.isArray(response)) {
          this.availableCategories = response;
        } else {
          console.error("Unexpected data format:", response);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    
    goHome(){
      const af = confirm("Are you sure you want to go back? All changes will be discarded");
      if(af){
        this.$router.push({ name: 'NoteList'});
      }else{
        return;
      }
    },

    async crearNota() {
      // Primero, aseguramos que el título y contenido tengan texto significativo.
      const trimmedTitle = this.noteTitle.trim();
      const trimmedContent = this.noteContent.trim();

      // Validación del título vacío o contenido vacío
      if (!trimmedTitle && !trimmedContent) {
        alert("Please, insert title or content into the note.");
        return;
      }
      // Validación de la longitud del título después de trim()
      if (trimmedTitle.length > 255) {
        alert("The title cannot have more then 255 characters.");
        return;
      }
      if (trimmedContent.length > 255) {
        alert("The content cannot have more then 255 characters.");
        return;
      }
      const nuevaNota = {
        title: this.noteTitle.trim(),
        content: this.noteContent.trim(),
        categories: this.selectedCategories.length > 0
          ? this.selectedCategories
          : []
      }
        //.map(cat => ({ id: cat.id })) antes tenia esto dps de selected categories pero no es necesario, se envia ya un objeto desde el multiselect      };

      try {
        await NoteRepository.save(nuevaNota);
        this.$router.push({ name: 'NoteList'});
      } catch (error) {
        console.error("Error creating note:", error);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert(error.message);
        }
      }
    }
  },

  async mounted() {
    try{
      await this.fetchCategories();
    }catch(error){
      console.error(error);
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
/* Contenedor principal */
div {
  max-width: 600px; /* Ancho máximo */
  margin: 0 auto; /* Centrado */
  padding: 20px; /* Espaciado interno */
  background-color: #ffffff; /* Fondo blanco */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
}

/* Estilo de encabezado */
h1 {
  color: #333; /* Color de texto oscuro */
  font-size: 28px; /* Tamaño de fuente */
  text-align: center; /* Centrar texto */
  margin-bottom: 20px; /* Espacio inferior */
}

/* Etiquetas */
label {
  font-weight: bold; /* Texto en negrita */
  display: block; /* Separa la etiqueta del campo */
  margin-bottom: 5px; /* Espacio inferior */
}

/* Estilo de campos de entrada */
input[type="text"],
textarea {
  width: 100%; /* Ancho completo */
  padding: 10px; /* Espaciado interno */
  border: 1px solid #ccc; /* Borde gris claro */
  border-radius: 5px; /* Bordes redondeados */
  margin-bottom: 15px; /* Espacio inferior */
  font-size: 16px; /* Tamaño de fuente */
  box-sizing: border-box; /* Incluye padding y border en el tamaño total */
  transition: border-color 0.3s; /* Transición suave para el borde */
}

/* Efecto al enfocar los campos */
input[type="text"]:focus,
textarea:focus {
  border-color: #007bff; /* Color de borde azul al enfocar */
  outline: none; /* Sin contorno */
}

/* Estilo para el botón */
button {
  background-color: #007bff; /* Color de fondo azul */
  color: #ffffff; /* Texto blanco */
  padding: 10px 20px; /* Espaciado interno */
  border: none; /* Sin borde */
  border-radius: 5px; /* Bordes redondeados */
  font-size: 16px; /* Tamaño de fuente */
  cursor: pointer; /* Cambia el cursor a puntero */
  transition: background-color 0.3s; /* Transición suave al cambiar el color */
  width: 100%; /* Ancho completo */
}

/* Efecto al pasar el mouse sobre el botón */
button:hover {
  background-color: #0056b3; /* Color de fondo más oscuro al pasar el mouse */
}

/* Estilo para el multiselect */
.multiselect {
  width: 100%; /* Ancho completo */
  margin-bottom: 15px; /* Espacio inferior */
}

/* Espaciado entre elementos */
.mb-3 {
  margin-bottom: 15px; /* Margen inferior */
}

.mt-3 {
  margin-top: 15px; /* Margen superior */
}
</style>
