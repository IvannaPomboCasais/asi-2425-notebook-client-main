<template>
  <div class="card" style="width: 18rem">
    <div class="card-body">
      <a href="#" @click.prevent="$emit('selectUser',user.login)">{{ user.login }}</a>
    </div>
    <button @click.prevent="$emit('delete-user', user.id)">
      Delete user
    </button>
    <button @click.prevent="$emit('activate-user', user.id)">
      {{ user.active ? 'Deactivate' : 'Activate' }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  }
};
</script>
<style scoped>
.card {
  border: 1px solid #e0e0e0; /* Borde ligero para las tarjetas */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra sutil para profundidad */
  margin: 10px; /* Espaciado alrededor de cada tarjeta */
  transition: transform 0.2s; /* Transición suave al pasar el mouse */
}

.card:hover {
  transform: scale(1.05); /* Efecto de escalado al pasar el mouse */
}

.card-body {
  padding: 16px; /* Espaciado interno en el cuerpo de la tarjeta */
}

.card a {
  color: #007bff; /* Color azul para los enlaces */
  text-decoration: none; /* Sin subrayado */
  font-weight: bold; /* Texto en negrita */
}

.card a:hover {
  text-decoration: underline; /* Subrayado al pasar el mouse */
}

button {
  margin-top: 10px; /* Espaciado superior para los botones */
  background-color: #007bff; /* Color verde para los botones */
  color: white; /* Texto blanco */
  border: none; /* Sin borde */
  border-radius: 5px; /* Bordes redondeados para los botones */
  padding: 8px 12px; /* Espaciado interno en los botones */
  cursor: pointer; /* Cambia el cursor al pasar el mouse */
  transition: background-color 0.2s; /* Transición suave del color de fondo */
}

button:hover {
  background-color: #0056b3; /* Color más oscuro al pasar el mouse */
}
</style>
