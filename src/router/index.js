import { createRouter, createWebHistory } from "vue-router";
import AboutView from "../views/AboutView.vue";
import NoteList from "../components/NoteList.vue";
import NoteForm from "../components/NoteForm.vue";
import NoteDetail from "../components/NoteDetail.vue";
import ErrorNotFoundView from "../views/ErrorNotFoundView.vue";
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";
import NoteEdit from "../components/NoteEdit.vue";
import UserList from "../components/UserList.vue";
import CategoryList from "../components/CategoryList.vue";
import CategoryForm from "../components/CategoryForm.vue";
import CategoryEdit from "../components/CategoryEdit.vue";

import auth from "@/common/auth";
import { getStore } from "@/common/store";
//todo lo que empieza por : en un path es una variable. Lleva el nombre en el this.route.params que se le de aquí
const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginForm,
    meta: { public: true, isLoginPage: true }
  },
  {
    path: "/reg",
    name: "Register",
    component: RegisterForm,
    meta: { public: true }
  },
  {
    path: "/activeUsers",
    name: "User",
    component: UserList,
  },
  {
    path: "/cat",
    name: "Category",
    component: CategoryList,
  },
  {
    path: "/cat/new",
    name: "CategoryCreate",
    component: CategoryForm,
  },
  {
    path: "/cat/edit/:catId",
    name: "CategoryEdit",
    component: CategoryEdit
  },
  {
    path: "/about",
    name: "about",
    component: AboutView
  },
  {
    path: '/notes',
    name: "NoteList",
    component: NoteList,
    props:true
  },
  {
    path: '/user/:userLogin',
    name: "NoteUser",
    component: NoteList
  },  
  {
    path: '/cat/:categoryName',
    name: "NoteCat",
    component: NoteList
  },    
  // /notes/new debe colocarse antes de /notes/:id porque si no vue-router
  // interpreta "new" como si fuera el id.
  //
  // Una forma de evitar este problema es usar una expresión regular para
  // limitar los valores que son interpretados. Por ejemplo, usando el path
  // /notes/:id(\\d+), vue-router espera que :id sea numérico.
  {
    path: "/notes/new",
    name: "NoteCreate",
    component: NoteForm
  },
  {
    path: "/notes/edit/:noteId",
    name: "NoteEdit",
    component: NoteEdit
  },
  {
    path: "/notes/:noteId",
    name: "NoteDetail",
    component: NoteDetail
  },
  {
    path: "/:catchAll(.*)*",
    component: ErrorNotFoundView,
    meta: { public: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  // Lo primero que hacemos antes de cargar ninguna ruta es comprobar si
  // el usuario está autenticado (revisando el token)
  auth.isAuthenticationChecked.finally(() => {
    // por defecto, el usuario debe estar autenticado para acceder a las rutas
    const requiresAuth = !to.meta.public;

    const requiredAuthority = to.meta.authority;
    const userIsLogged = getStore().state.user.logged;
    const loggedUserAuthority = getStore().state.user.authority;

    if (requiresAuth) {
      // página privada
      if (userIsLogged) {
        if (requiredAuthority && requiredAuthority != loggedUserAuthority) {
          // usuario logueado pero sin permisos suficientes, le redirigimos a la página de login
          alert("Acceso prohibido para el usuario actual; intenta autenticarte de nuevo");
          auth.logout();
          next("/");
        } else {
          // usuario logueado y con permisos adecuados
          next();
        }
      } else {
        // usuario no está logueado, no puede acceder a la página
        alert("Esta página requiere autenticación");
        next("/");
      }
    } else {
      // página pública
      if (userIsLogged && to.meta.isLoginPage) {
        // si estamos logueados no hace falta volver a mostrar el login
        next({ name: "NoteList", replace: true });
      } else {
        next();
      }
    }
  });
});

export default router;
