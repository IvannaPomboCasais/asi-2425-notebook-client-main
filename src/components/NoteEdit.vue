<template>
  <div>
    <h1>Edit note</h1>

    <div class="mb-3 mt-3">
      <label for="title">Introduce new title: </label>
      <input
        type="text"
        id="newTitle"
        v-model="newNoteTitle"
        maxlength="300"
        placeholder="Insert new title"
        @keyup.enter="updateNote"
      />
    </div>

    <div class="mb-3">
      <label for="content">Introduce new content: </label>
      <textarea
        id="newContent"
        v-model="newNoteContent"
        placeholder="Insert new content"
        @keyup.enter="updateNote"
      ></textarea>
    </div>

    <!-- Checkbox para cambiar el estado de archivada -->
    <div class="mb-3">
      <label>
        <input 
          type="checkbox" 
          v-model="newArchived" 
        />
        Archived
      </label>
    </div>

    <div class="mb-3">
      <label for="category">Categories: </label>
      <multiselect
        v-model="newSelectedCategories"
        :options="availableCategories"
        :multiple="true"
        label="name"
        track-by="id"
        placeholder="Select one or more categories if you want"
        @keyup.enter="updateNote"
      ></multiselect>
    </div>

    <button @click="updateNote">Save changes</button>
    <button class="btn btn-primary mt-2 me-2" @click.prevent="goHome">Go back to the list</button>
  </div>
</template>

<script>
import NoteRepository from "../repositories/NoteRepository";
import Multiselect from 'vue-multiselect';
import CategoryRepository from "../repositories/CategoryRepository";

export default {
  components: {
    Multiselect,
  },

  data() {
    return {
      note: {}, // Contiene los datos originales de la nota
      newNoteTitle: '', // Para almacenar el nuevo título (cadena vacía por defecto)
      newNoteContent: '', // Para almacenar el nuevo contenido (cadena vacía por defecto)
      newArchived: false, // Para almacenar el estado de archivado
      newSelectedCategories: [], // Para almacenar las categorías seleccionadas
      availableCategories: [], // Para cargar todas las categorías disponibles
      loading: true,
    };
  },

  methods: {
    // Obtener los datos de la nota
    async fetchNote() {
      try {
        const noteId = this.$route.params.noteId;
        this.note = await NoteRepository.findOne(noteId);
        this.newNoteTitle = this.note.title || '';  // Asignar '' si es null
        this.newNoteContent = this.note.content || '';  // Asignar '' si es null
        this.newArchived = this.note.archived;
        this.newSelectedCategories = this.note.categories || [];
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        this.loading = false;
      }
    },

    goHome() {
      const af = confirm("Are you sure you want to go back? All changes will be discarded");
      if (af) {
        this.$router.push({ name: 'NoteList' });
      } else {
        return;
      }
    },

    // Obtener las categorías disponibles
    async fetchCategories() {
      try {
        this.availableCategories = await CategoryRepository.findAll();
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },

    // Actualizar la nota con los nuevos datos
    async updateNote() {
      const confirmed = confirm("Are you sure you want to save changes?");
      if (confirmed) {
        // Validar que el título y contenido no sean null o undefined
        const trimmedTitle = (this.newNoteTitle || '').trim();
        const trimmedContent = (this.newNoteContent || '').trim();

        // Validación de que título o contenido no estén vacíos
        if (!trimmedTitle && !trimmedContent) {
          alert("Please, insert title or content into the note.");
          return;
        }

        // Validar longitud del título y contenido
        if (this.newNoteTitle.length > 255 || this.newNoteContent.length > 255) {
          alert("The title and the content can only have 255 characters.");
          return;
        }

        const updatedNote = {
          id: this.note.id,
          title: this.newNoteTitle,
          content: this.newNoteContent,
          timestamp: this.note.timestamp, // Mantener la fecha original
          archived: this.newArchived, // Estado de archivado actualizado
          categories: this.newSelectedCategories,
        };

        try {
          await NoteRepository.save(updatedNote);
          this.$router.push({ name: 'NoteDetail', params: { noteId: this.note.id } });
        } catch (error) {
          console.error("Error updating note:", error);
        }
      }
    },
  },

  async mounted() {
    try {
      await this.fetchNote(); // Cargar la nota al montar el componente
      await this.fetchCategories(); // Cargar las categorías al montar el componente
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
/* Estilo general para el contenedor principal */
div {
  max-width: 500px; /* Ancho máximo del contenedor */
  margin: 20px auto; /* Centrar el contenedor */
  padding: 8px; /* Espaciado interno */
  background-color: #ffffff; /* Fondo blanco */
}

/* Estilo para los encabezados */
h1 {
  color: #333; /* Color de texto oscuro */
  font-size: 24px; /* Tamaño de fuente mayor */
  text-align: center; /* Centrar el texto */
  margin-bottom: 20px; /* Espaciado inferior */
}

/* Estilo para las etiquetas de los campos */
label {
  display: block; /* Hace que las etiquetas ocupen todo el ancho */
  margin-bottom: 5px; /* Espaciado inferior */
}

/* Estilo para los inputs y textareas */
input[type="text"],
textarea {
  width: 100%; /* Ocupa el 100% del ancho disponible */
  padding: 10px; /* Espaciado interno */
  border: 1px solid #ccc; /* Borde gris claro */
  border-radius: 4px; /* Bordes redondeados */
  margin-bottom: 15px; /* Espaciado inferior */
}

/* Efecto al enfocar los inputs y textareas */
input[type="text"]:focus,
textarea:focus {
  border-color: #007bff; /* Color de borde azul al enfocar */
  outline: none; /* Sin contorno */
}

/* Estilo para el checkbox */
input[type="checkbox"] {
  margin-right: 5px; /* Espaciado a la derecha */
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
}

/* Efecto al pasar el ratón sobre el botón */
button:hover {
  background-color: #0056b3; /* Color de fondo más oscuro al pasar el mouse */
}
</style>
