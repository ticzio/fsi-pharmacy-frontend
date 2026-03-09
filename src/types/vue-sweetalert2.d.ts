// Permite importar 'vue-sweetalert2' sin error de tipos
import type Swal from 'sweetalert2'

import 'vue'
declare module 'vue' {
  interface ComponentCustomProperties {
    $swal: typeof Swal
  }
}
