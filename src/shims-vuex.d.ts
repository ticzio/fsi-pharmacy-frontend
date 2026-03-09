// Permite importar Vuex sin error de typings en proyectos Vue 3 + TS
// Soluciona: Could not find a declaration file for module 'vuex'
declare module 'vuex'
declare module 'vue-sweetalert2'
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
