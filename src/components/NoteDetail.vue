<template>
  <div v-if="note">
    <h3>Details of the note</h3>
    <span v-if="isAdmin">
      <router-link :to="`/user/${note.owner}`" class="category-link">
            {{ note.owner }}
      </router-link>
    </span><br />  
    <span v-if="note.title">Title: {{ note.title }}</span><br />
    <span v-if="note.content">Content: {{ note.content }}</span><br />
    <span> Archived: </span>
    <input type = "checkbox" disabled v-model="note.archived" /><br />
    <span>Creation date: {{ formatDate(note.timestamp) }}</span><br />
    <h6 class="card-subtitle mb-2 text-muted">
      <span v-for="(category, index) in note.categories" :key="index" >
        <router-link :to="`/cat/${category.name}`" class="category-link" v-if="note.categories">
          {{ category.name }}
        </router-link>
        <span v-if="index < note.categories.length - 1">, </span>
      </span>
    </h6>

    <!-- Cambiar la clase de 'btn-secondary' a 'btn-primary' para mantener el mismo color azul -->
  <button class="btn btn-primary me-2" @click.prevent="archive" v-if="!isAdmin">
    {{ note.archived ? 'Unarchive' : 'Archive' }} note
  </button>
  <button class="btn btn-primary me-2" @click.prevent="editNote" v-if="!isAdmin">Edit Note</button>
  <button class="btn btn-primary" @click.prevent="deleteNote" v-if="!isAdmin">Delete Note</button>
  <button class="btn btn-primary me-2" @click.prevent="goHome">Go back to the list</button>
</div>
</template>

<script>
import NoteRepository from "../repositories/NoteRepository";
import auth from "@/common/auth.js";

//si aqui hay const p.e. no se podra acceder a ellas desde el template
//se puede poner en el div v-if="note" en vez de parámetro a parámetro p v-if="note" para el templlate
export default {
//data devuelve un objeto el cual va a ser usado en la vista
  data() {
    return {
      note: null,
      isAdmin: auth.isAdmin()
    };
  },
  methods: {
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}/${month}/${year}, a las ${hours}:${minutes}`;
    },
    goHome(){
      this.$router.push({ name: 'NoteList'});
    },
    async fetchNote() {
      try {
        const noteId = this.$route.params.noteId;
        this.note = await NoteRepository.findOne(noteId);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    },
    editNote() {
        this.$router.push({ name: 'NoteEdit', params: { noteId: this.note.id } });
    },
    async archive() {
      if (this.note) {
        try{
          this.note.archived = !this.note.archived;
          await NoteRepository.save(this.note);
          this.$router.push({name:'NoteList'});
        }catch(error){
          console.error(error);
        }
      }
    },
    async deleteNote(){
      if(confirm("Are you sure you want to delete this note?")){
        try{
          await NoteRepository.delete(this.note.id);
          this.$router.push({name:'NoteList'});
        }catch(error){
          console.error("Error deleting note", error)
        }
      }
    }
  },

  async mounted() {
    try{
      await this.fetchNote();
    }catch(error){
      console.error(error);
    }
  }
};
</script>
<style scoped>
/* Estilo para el contenedor principal */
div {
  max-width: 600px; /* Ancho máximo del contenedor */
  margin: 20px auto; /* Centrar el contenedor */
  padding: 20px; /* Espaciado interno */
  background-color: #f9f9f9; /* Fondo gris claro */
  border: 1px solid #ddd; /* Borde gris */
  border-radius: 4px; /* Bordes redondeados */
}

/* Estilo para los encabezados */
h2, h3, h6 {
  color: #333; /* Color de texto oscuro */
  margin-bottom: 10px; /* Espaciado inferior */
}

/* Estilo para el contenido de la nota */
p {
  margin: 10px 0; /* Espaciado superior e inferior */
  color: #555; /* Color de texto gris */
}

/* Estilo para el checkbox */
input[type="checkbox"] {
  margin-left: 5px; /* Espaciado a la izquierda */
}

/* Estilo para los botones */
button {
  background-color: #007bff; /* Color de fondo azul */
  color: white; /* Color de texto blanco */
  border: none; /* Sin borde */
  border-radius: 4px; /* Bordes redondeados */
  padding: 10px 15px; /* Espaciado interno */
  font-size: 16px; /* Tamaño de fuente */
  cursor: pointer; /* Cambia el cursor a puntero */
  margin-right: 5px; /* Espaciado a la derecha */
}

/* Efecto al pasar el ratón sobre el botón */
button:hover {
  background-color: #0056b3; /* Color de fondo más oscuro al pasar el mouse */
}
/* Estilo general para los botones */
button {
  background-color: #007bff; /* Azul claro */
  color: white; /* Texto en blanco */
  border: none; /* Sin borde */
  border-radius: 4px; /* Bordes redondeados */
  padding: 10px 15px; /* Tamaño del botón */
  font-size: 16px; /* Tamaño de la fuente */
  cursor: pointer; /* Cambia a puntero al pasar el ratón */
  margin-right: 5px; /* Margen derecho */
  margin-top: 10px; /* Espaciado superior */
}

/* Ajuste para el botón de "Go back to the list" */
.btn-secondary {
  background-color: #6c757d; /* Color gris claro para "Go back to the list" */
}

/* Efecto hover para todos los botones */
button:hover {
  background-color: #0056b3; /* Fondo más oscuro en hover para los botones principales */
}

.btn-secondary:hover {
  background-color: #5a6268; /* Fondo gris más oscuro para el botón de "Go back to the list" */
}


</style>

