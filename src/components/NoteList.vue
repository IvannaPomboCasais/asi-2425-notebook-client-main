<template>
  <div class="container">
    <div class="float-end" v-if="!isAdmin">
      <router-link class="btn btn-primary" :to="'/notes/new'">Create new note</router-link>
    </div>

    <div>
      <button class="btn btn-secondary mb-4 me-5" @click.prevent="clearFilter">Clean filter</button>
      <button class="btn btn-secondary mb-4" @click.prevent="toggleArchived" v-if="!isAdmin">
        {{ showArchived ? 'Hide Archived Notes' : 'Show Archived Notes' }}
      </button>
    </div>
    <div>
      <h1 v-if="isAdmin || showArchived">List of all notes: {{ filteredAllNotes.length }}</h1>
      <h1 v-if="!isAdmin && !showArchived">List of unarchived notes: {{ filteredNotes.length }}</h1>
      <h1 v-if="userfilter">Notes of {{ userFilterName }}</h1>
      <h1 v-if="catfilter">Notes of {{ categoryFilterName }}</h1>
    </div>

    <div v-if="isAdmin || showArchived" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col mb-3" v-for="note in filteredAllNotes" :key="note.id">
        <NoteCard
          :note="note"
          @archive-note="handleArchiveNote"
          @delete-note="deleteNote"
        />
      </div>
    </div>

    <div v-if="!isAdmin && !showArchived" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col mb-3" v-for="note in filteredNotes" :key="note.id">
        <NoteCard
          :note="note"
          @archive-note="handleArchiveNote"
          @delete-note="deleteNote"
        />
      </div>
    </div>
  </div>
</template>


<script>
import UserRepository from "@/repositories/UserRepository";
import NoteRepository from "../repositories/NoteRepository";
import NoteCard from "./NoteCard.vue";
import auth from "@/common/auth.js";

export default {
  data() {
    return {
      notes: [],             // Notas no archivadas
      allNotes: [],          // Todas las notas
      showArchived: false,   // Mostrar notas archivadas
      isAdmin: auth.isAdmin(),
      userFilterName: '',
      categoryFilterName: '',
      userfilter: false,
      catfilter: false,
    };
  },

  components: { NoteCard },

  computed: {
    filteredAllNotes() {
      // Solo se filtran las notas si hay filtro activo, y se hace de manera reactiva
      return this.getFilteredNotes(this.allNotes);
    },
    filteredNotes() {
      return this.getFilteredNotes(this.notes);
    }
  },

  methods: {
    async loadNotes() {
      try {
        this.allNotes = await NoteRepository.findAll();
        
        if (this.isAdmin) {
          const allUsers = await UserRepository.getAll();
          this.allNotes = this.allNotes.filter(note =>
            allUsers.some(user => user.login === note.owner && user.active)
          );
        }
        this.allNotes.sort((a,b)=> b.timestamp -a.timestamp);
        // Actualiza las listas de notas no archivadas y archivadas
        this.notes = this.allNotes.filter(note => !note.archived);
      } catch (error) {
        console.error("Error fetching notes:", error);
        alert("Error al cargar las notas: " + error.message);
      }
    },

    getFilteredNotes(notes) {
      let filtered = notes;

      if (this.userfilter && this.userFilterName) {
        filtered = filtered.filter(note => note.owner === this.userFilterName);
      }

      if (this.catfilter && this.categoryFilterName) {
        filtered = filtered.filter(note =>
          note.categories && note.categories.some(category => category.name === this.categoryFilterName)
        );
      }
      
      return filtered;
    },

    applyRouteFilter() {
      if (this.$route.params.userLogin) {
        this.userFilterName = this.$route.params.userLogin;
        this.userfilter = true;
      } else {
        this.userfilter = false;
        this.userFilterName = '';
      }

      if (this.$route.params.categoryName) {
        this.categoryFilterName = this.$route.params.categoryName;
        this.catfilter = true;
      } else {
        this.catfilter = false;
        this.categoryFilterName = '';
      }
    },

    clearFilter() {
      this.$router.push({ name: 'NoteList' });
      this.applyRouteFilter();
    },

    toggleArchived() {
      this.showArchived = !this.showArchived;
    },

    async handleArchiveNote(note) {
      try {
        const updatedNote = { ...note, archived: !note.archived };
        await NoteRepository.save(updatedNote);
        await this.loadNotes();  // Cargar de nuevo las notas tras archivar
      } catch (error) {
        console.error("Error archiving note:", error);
        alert("Error filing the note: " + error.message);
      }
    },

    async deleteNote(noteId) {
      if (confirm("Are you sure you want to delete this note?")) {
        try {
          await NoteRepository.delete(noteId);
          await this.loadNotes();  // Cargar de nuevo las notas tras eliminar
        } catch (error) {
          console.error("Error deleting note", error);
        }
      }
    },
  },

  watch: {
    '$route': {
      handler: 'applyRouteFilter',  // Aplica el filtro solo cuando la ruta cambia
      immediate: true,
    },
  },
  
  async mounted() {
    try{
      await this.loadNotes();  
      this.applyRouteFilter();  
    }catch(error){
      console.error(error);
    }
  },
};
</script>


<style scoped>
/* Estilos generales del contenedor */
.container {
  max-width: 1200px; /* Ancho máximo del contenedor */
  margin: 0 auto; /* Centrar el contenedor */
  padding: 20px; /* Espaciado interno */
  background-color: #f9f9f9; /* Color de fondo suave */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

/* Estilo para los encabezados */
h1 {
  color: #333; /* Color de texto oscuro */
  margin-bottom: 20px; /* Espaciado inferior */
  font-size: 24px; /* Tamaño de fuente */
}

/* Estilo para botones */
.btn {
  background-color: #007bff; /* Color de fondo azul */
  color: #fff; /* Color de texto blanco */
  padding: 10px 20px; /* Espaciado interno */
  border: none; /* Sin borde */
  border-radius: 5px; /* Bordes redondeados */
  font-size: 16px; /* Tamaño de fuente */
  cursor: pointer; /* Cambia el cursor a puntero */
  transition: background-color 0.3s; /* Transición suave al cambiar el color */
}

.btn:hover {
  background-color: #0056b3; /* Color de fondo más oscuro al pasar el mouse */
}

/* Estilos para las tarjetas de notas */
.note-card {
  background-color: #fff; /* Fondo blanco para las notas */
  border: 1px solid #ddd; /* Borde gris claro */
  border-radius: 8px; /* Bordes redondeados */
  padding: 15px; /* Espaciado interno */
  transition: box-shadow 0.3s; /* Transición suave para la sombra */
}

.note-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Sombra más intensa al pasar el mouse */
}

/* Espaciado entre columnas */
.row {
  margin-bottom: 20px; /* Espaciado inferior entre filas */
}

/* Estilo para las tarjetas de notas */
.col {
  padding: 10px; /* Espaciado entre columnas */
}

/* Estilo para las listas */
h1 {
  font-weight: bold; /* Texto en negrita */
}

/* Estilo para la sección de notas archivadas */
.archived-notes {
  margin-top: 40px; /* Margen superior para separar de las notas no archivadas */
  padding: 20px; /* Espaciado interno */
  border: 1px dashed #ccc; /* Borde punteado */
  border-radius: 8px; /* Bordes redondeados */
  background-color: #f0f8ff; /* Fondo azul claro */
}
</style>