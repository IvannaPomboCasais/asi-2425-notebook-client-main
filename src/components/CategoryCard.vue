<template>
  <div>
    <div class="card" style="width: 18rem">
      <div class="card-body">
        <a href="#" @click.prevent="$emit('selectCat',cat.name)"> {{ cat.name }} </a>
      </div>
      <div>
      <button class="mb-3" @click.prevent="editCategory">
        Edit Category
      </button>
      </div>
      <button @click.prevent="$emit('delete-category', cat.id)">
        Delete category
      </button>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    cat: {
      type: Object,
      required: true
    }
  },
  methods: {
      editCategory() {
        this.$router.push({ name: 'CategoryEdit', params: { catId: this.cat.id } });
      }
  }
}
</script>
<style scoped>
/* Estilo para la tarjeta */
.card {
  border: 1px solid #ddd; /* Borde gris claro */
  border-radius: 8px; /* Bordes redondeados */
  padding: 15px; /* Espaciado interno */
  margin: 10px 0; /* Espaciado vertical */
  background-color: #ffffff; /* Fondo blanco */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

/* Estilo para el texto de la tarjeta */
.card-text {
  font-size: 14px; /* Tamaño de fuente */
  color: #333; /* Color de texto oscuro */
  margin-bottom: 10px; /* Espaciado inferior */
}

/* Estilo para el enlace */
a {
  color: #007bff; /* Color azul */
  text-decoration: none; /* Sin subrayado */
}

a:hover {
  text-decoration: underline; /* Subrayado al pasar el mouse */
}

/* Estilo para los botones */
button {
  background-color: #007bff; /* Color de fondo azul */
  color: white; /* Color de texto blanco */
  border: none; /* Sin borde */
  border-radius: 4px; /* Bordes redondeados */
  padding: 8px 12px; /* Espaciado interno */
  font-size: 14px; /* Tamaño de fuente */
  cursor: pointer; /* Cambia el cursor a puntero */
  margin-right: 5px; /* Espaciado a la derecha */
}

button:hover {
  background-color: #0056b3; /* Color de fondo más oscuro al pasar el mouse */
}
</style>


