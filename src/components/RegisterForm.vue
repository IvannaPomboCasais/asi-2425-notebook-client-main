<template>
  <div>
    <div class="mb-3 mt-3">
       <label for="login">Login: </label>
       <input type="text" id="login" v-model="login" @keyup.enter="register()" />
    </div>
    <div class="mb-3">
        <label for="pass">Password: </label>
        <input type="password" id="pass" v-model="pass" @keyup.enter="register()" />
    </div>
    <div class="mb-3">
        <label for="passR">Repeat the password: </label>
        <input type="password" id="passR" v-model="passR" @keyup.enter="register()" />
    </div>
    <div>
        <button @click="register()">Register</button>
    </div>
    <p>Do you already have an account? <a href="#" @click="authenticate()">Sign in</a></p>
  </div>
</template>

<script>
import auth from "../common/auth.js";

export default {
  data() {
    return {
      login: null,
      pass: null,
      passR: null
    };
  },
  methods: {
    async authenticate() {
      try {
        this.$router.push("/");
      } catch (e) {
        console.error(e);
        if (e.response?.data?.message) {
          alert(e.response.data.message);
        } else {
          alert(e.message);
        }
      }
    },
    async register() {
      if (!this.login){
        alert("You have to introduce a login.");
        return;
      }
      //probar que funcione asi bien
      if(this.login.length<4 || this.login.length > 255){
        alert("The login must have 4 characters at least and cannot take more than 255 characters");
        return;
      }
      if (!this.pass){
        alert("You have to introduce a password.");
        return;
      }
      if(this.pass.length<4){
        alert("The password must have 4 characters at least");
        return;
      }
      if (this.pass !== this.passR) {
        alert("Passwords don't match.");
        return;
      }
      try {
        await auth.register({
          login: this.login.trim().toLowerCase(),
          password: this.pass
        });
        await auth.login({
          login: this.login.trim().toLowerCase(),
          password: this.pass
        });
        this.$router.push("/notes");
      } catch (e) {
        console.error(e);
        if (e.response?.data?.message) {
          alert(e.response.data.message);
        } else {
          alert(e.message);
        }
      }
    }
  }
};
</script>
<style scoped>
div {
  max-width: 400px; /* Limita el ancho del formulario */
  margin: auto; /* Centra el formulario horizontalmente */
  padding: 20px; /* Espaciado interno para el formulario */
  border: 1px solid #e0e0e0; /* Borde sutil */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra para profundidad */
  background-color: #fff; /* Color de fondo blanco */
}

label {
  display: block; /* Asegura que cada etiqueta esté en una nueva línea */
  margin-bottom: 5px; /* Espaciado inferior para etiquetas */
  font-weight: bold; /* Texto en negrita */
}

input[type="text"],
input[type="password"] {
  width: 100%; /* Ancho completo del contenedor */
  padding: 10px; /* Espaciado interno en los campos */
  margin-bottom: 15px; /* Espaciado inferior entre campos */
  border: 1px solid #ccc; /* Borde sutil en los campos */
  border-radius: 4px; /* Bordes redondeados en los campos */
  box-sizing: border-box; /* Incluye el padding en el ancho total */
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #007bff; /* Cambio de color del borde al enfocar */
  outline: none; /* Sin contorno */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Sombra azul al enfocar */
}

button {
  width: 100%; /* Botón de ancho completo */
  padding: 10px; /* Espaciado interno en el botón */
  background-color: #007bff; /* Color azul para el botón */
  color: white; /* Texto blanco en el botón */
  border: none; /* Sin borde */
  border-radius: 4px; /* Bordes redondeados para el botón */
  cursor: pointer; /* Cambia el cursor al pasar el mouse */
  transition: background-color 0.2s; /* Transición suave al cambiar de color */
}

button:hover {
  background-color: #0056b3; /* Color más oscuro al pasar el mouse */
}

p {
  text-align: center; /* Centra el texto del párrafo */
}

a {
  color: #007bff; /* Color azul para el enlace */
  text-decoration: none; /* Sin subrayado en el enlace */
}

a:hover {
  text-decoration: underline; /* Subrayado al pasar el mouse */
}
</style>

