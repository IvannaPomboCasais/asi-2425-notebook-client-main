<template>
    <div>
        <h1>Edit category</h1>
        <div class="mb-3 mt-3">
            <label for="title">New name: </label>
            <input
                type="text"
                id="newName"
                v-model="newName"
                placeholder="Introduce the new name of the category"
                @keyup.enter="updateCategory()"
            />
        </div>
        <button @click="updateCategory">Save changes</button>
        <button class="btn btn-primary mt-2 me-2" @click.prevent="goHome">Go back to the category list</button>
    </div>
</template>
<script>
import CategoryRepository from "../repositories/CategoryRepository";
export default{
    data(){
        return{
            category: {},
            newName : '',
            categories:[],
        };
    },
    methods: {
        async fetchCategory(){
            try{
                //tiene que llevar el nombre que lleva en la ruta en el index
                const catId = this.$route.params.catId;
                this.category = await CategoryRepository.findOne(catId);
                this.newName = this.category.name;
            }catch(error){
                console.error("Error fetching category:", error);
            }
        },
        goHome(){
            const af = confirm("Are you sure you want to go back? All changes will be discarded");
            if(af){
                this.$router.push({ name: 'Category'});
            }else{
            return;
            }
        },
        formatCategoryName(string) {
            if (!string) return '';
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        },

        async updateCategory(){
            this.newName = this.formatCategoryName(this.newName.trim());

            const categoryExists = this.categories.some(
            (cat) => cat.name.toLowerCase() === this.newName.toLowerCase()
            );

            if (categoryExists) {
                alert("This category already exists.");
                return;
            }
            const confirmed = confirm("Are you sure you want to save the change?");
            if(confirmed){
                this.category.name = this.newName;

                const updatedCat = {
                    id:this.category.id,
                    name: this.category.name,
                };
                try{
                    await CategoryRepository.save(updatedCat);
                    this.$router.push({name:'Category'});
                }catch(error){
                    console.error("Error updating category:", error);
                }
            }

        }

    },
    async mounted() {
        try{
            await this.fetchCategory();
            this.categories = await CategoryRepository.findAll();
        }catch(error){
            console.error(error);
        }
    },
};
</script>
<style scoped>
/* Estilo para el contenedor principal */
div {
  max-width: 500px; /* Ancho máximo del contenedor */
  margin: 20px auto; /* Centra el contenedor */
  padding: 20px; /* Espaciado interno */
  background-color: #ffffff; /* Fondo blanco */
  border: 1px solid #ddd; /* Borde gris claro */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

/* Estilo para el encabezado */
h1 {
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
