<template>
  <div>
    <h1>List of registered users</h1>
    <h2>Active Users</h2>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <div class="col mb-3" v-for="user in activeUsers" :key="user.id">
        <UserCard
          :user="user"
          @delete-user="deleteUser"
          @activate-user="activateUser"
          @selectUser="handleUserSelected"
        />
      </div>
    </div>
    <h2>Unactive Users</h2>
    <div>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
        <div class="col mb-3" v-for="user in unactiveUsers" :key="user.id">
          <UserCard
            :user="user"
            @delete-user="deleteUser"
            @activate-user="activateUser"
            @selectUser="handleUserSelected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserRepository from "../repositories/UserRepository";
import UserCard from "./UserCard.vue";

export default {
  data() {
    return {
      activeUsers: [],
      unactiveUsers: [],
      allUsers:[],
    };
  },
  components: { UserCard },
  methods: {
    async deleteUser(id) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await UserRepository.delete(id);
          //para mostrar cambios en la pagina
          //this.allUsers = this.allUsers.filter(user => user.id !== id);
          this.getFilterUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    },
    async getFilterUsers(){
      try{
      //al añadir aqui esta línea en lugar de en el mounted se recarga la pagina automáticamente en lugar de usando las lineas comentadas en los metodos
        this.allUsers = await UserRepository.getAll();
        this.activeUsers = this.allUsers.filter(user => user.active === true);
        this.unactiveUsers = this.allUsers.filter(user => user.active === false);
      }catch(error){
        console.error(error);
      }  
    },
    async activateUser(id) {
      try{
        const user = this.allUsers.find(user=> user.id == id);
        if (!user) {
        console.error(`User with ID ${id} not found`);
        return; // Salir de la función si no se encuentra el usuario
        }
        if(user.active==true){
          await UserRepository.deactivate(id);
        }else if(user.active ==false){
          await UserRepository.activate(id);
        }
        //para mostrar cambios en la pagina
        //user.active = !user.active;
        
        this.getFilterUsers();
      }catch(error){
        console.error(error);
      }  
    },
    handleUserSelected(userLogin) {
      this.$router.push({ name: 'NoteUser', params: { userLogin: userLogin} });
    },
  },
  async mounted() {
    try {
      this.getFilterUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },
};
</script>
<style scoped>
/* Estilo general del contenedor */
div {
  padding: 20px; /* Espaciado interno */
}

/* Estilo para los encabezados */
h1 {
  color: #333; /* Color de texto oscuro */
  font-size: 28px; /* Tamaño de fuente */
  margin-bottom: 20px; /* Espaciado inferior */
  text-align: center; /* Centra el texto */
}

h2 {
  color: #007bff; /* Color azul para subtítulos */
  font-size: 24px; /* Tamaño de fuente */
  margin-top: 30px; /* Espaciado superior */
  margin-bottom: 10px; /* Espaciado inferior */
}

/* Estilo para la fila de tarjetas de usuario */
.row {
  display: flex; /* Usa Flexbox para organizar las columnas */
  flex-wrap: wrap; /* Permite que las columnas se envuelvan */
}

/* Estilo para las columnas */
.col {
  padding: 10px; /* Espaciado interno de las columnas */
}

/* Espaciado entre tarjetas */
.mb-3 {
  margin-bottom: 15px; /* Espaciado inferior */
}
</style>

