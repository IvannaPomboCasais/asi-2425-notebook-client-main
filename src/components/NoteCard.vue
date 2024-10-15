<template>
  <div class="card" style="width: 18rem">
    <div class="card-body">
      <h5 class="card-subtitle mb-2 text-muted" v-if="isAdmin">
        <router-link :to="`/user/${note.owner}`" class="category-link">
          {{ note.owner }}
        </router-link>
      </h5>
      <h5 class="card-text" v-if="note.title">Title: {{ note.title }}</h5>
      <p class="card-text" v-if="note.content">Content: {{ note.content }}</p>
      <span :style="{ color: note.archived ? 'red' : 'green' }">
        {{ note.archived ? 'Archived' : 'Unarchived' }}
      </span>
      <p class="card-textCO"> Creation date:
        <router-link class="date-link" :to="`/notes/${note.id}`">
          {{ formatDate(note.timestamp) }}
        </router-link>
      </p>
      <h6 class="card-subtitle mb-2 text-muted">
        <span v-for="(category, index) in note.categories" :key="index" >
          <router-link :to="`/cat/${category.name}`" class="category-link" v-if="note.categories">
            {{ category.name }}
          </router-link>
          <span v-if="index < note.categories.length - 1">, </span>
        </span>
      </h6>
    </div>
    <div class="button-group">
      <button @click.prevent="$emit('archive-note', note)" v-if="!isAdmin" class="icon-button">
        <i class="fas" :class="note.archived ? 'fa-folder-open' : 'fa-folder'"></i>
      </button>
      <button @click.prevent="editNote" v-if="!isAdmin" class="icon-button">
        <i class="fas fa-edit"></i>
      </button>
      <button @click.prevent="$emit('delete-note', note.id)" v-if="!isAdmin" class="icon-button">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  </div>
</template>

<script>
import auth from "@/common/auth";

export default {
  props: {
    note: {
      type: Object,
      required: true
    }
  },
  computed: {
    isAdmin() {
      return auth.isAdmin();
    }
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
    editNote() {
      this.$router.push({ name: 'NoteEdit', params: { noteId: this.note.id } });
    },  
  }
};
</script>

<style scoped>
/* Estilo de la tarjeta */
.card {
  background-color: #fff; /* Fondo blanco */
  border: 1px solid #ddd; /* Borde gris claro */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra suave */
  transition: box-shadow 0.3s; /* Transición suave para la sombra */
  margin-bottom: 20px; /* Espaciado inferior */
}

/* Efecto al pasar el ratón sobre la tarjeta */
.card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Sombra más intensa al pasar el mouse */
}

/* Estilo para el cuerpo de la tarjeta */
.card-body {
  padding: 15px; /* Espaciado interno */
}

/* Estilo para el título y texto de la tarjeta */
.card-text {
  color: #333; /* Color de texto oscuro */
  margin-bottom: 10px; /* Espaciado inferior */
  font-size: 18px; /* Tamaño de fuente */
}

/* Estilo para el subtítulo de la tarjeta */
.card-subtitle {
  color: #777; /* Color de texto gris */
}

/* Estilo para el enlace de la categoría */
.category-link {
  color: #007bff; /* Color azul para el enlace */
  text-decoration: none; /* Sin subrayado */
}

.category-link:hover {
  text-decoration: underline; /* Subrayado al pasar el ratón */
}

/* Estilo para el enlace de fecha */
.date-link {
  color: #007bff; /* Color azul para el enlace de fecha */
  text-decoration: none; /* Sin subrayado */
}

/* Cambiar color de enlace de fecha al pasar el ratón */
.date-link:hover {
  text-decoration: underline; /* Subrayado al pasar el ratón */
}

/* Estilo para el grupo de botones */
.button-group {
  display: flex; /* Usar flexbox para alinear botones */
  justify-content: space-between; /* Espaciado uniforme */
  margin-top: 10px; /* Margen superior para separación */
}

/* Estilo para los botones de icono */
.icon-button {
  background-color: transparent; /* Fondo transparente */
  border: none; /* Sin borde */
  cursor: pointer; /* Cambia el cursor a puntero */
  font-size: 20px; /* Tamaño de fuente del icono */
  transition: transform 0.2s; /* Transición suave para el efecto de hover */
}

/* Efecto al pasar el ratón sobre los botones de icono */
.icon-button:hover {
  transform: scale(1.1); /* Aumentar ligeramente el tamaño del icono */
}

/* Estilo para el texto del estado de archivado */
.card-textCO {
  font-size: 14px; /* Tamaño de fuente para el texto de fecha */
  margin-top: 10px; /* Margen superior para separación */
}
</style>
